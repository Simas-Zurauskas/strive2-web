/**
 * rebuild-docs.js — Multi-agent documentation engine.
 *
 * Orchestrates parallel Claude agents to audit and rebuild Notion documentation:
 *   Phase A: Prepare — fetch docs, generate manifest, bundle docs
 *   Phase B: Plan   — orchestrator agent produces structured task plan
 *   Phase C: Execute — worker agents read source files & write markdown in parallel,
 *                      then sequential Notion write pass applies changes
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... NOTION_API_KEY=... NOTION_TECHNICAL_ROOT_ID=... node rebuild-docs.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { query } = require('@anthropic-ai/claude-agent-sdk');

const SCRIPTS_DIR = __dirname;
const REPO_ROOT = path.resolve(SCRIPTS_DIR, '../..');
const DOCS_DIR = path.join(REPO_ROOT, '_docs');
const DOCS_INDEX_PATH = path.join(DOCS_DIR, '_index.json');
const NOTION_TOOL = path.join(SCRIPTS_DIR, 'notion-tool.js');

const CONCURRENCY = 5;
const WORKER_MAX_TURNS = 30;
const MODEL = 'claude-sonnet-4-20250514';

// ---------------------------------------------------------------------------
// Phase A: Prepare
// ---------------------------------------------------------------------------

function generateManifest() {
  const run = (cmd) => execSync(cmd, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();

  const files = run("find src -type f \\( -name '*.ts' -o -name '*.tsx' \\) | grep -v '_generated' | sort");
  const dirs = run('find src -type d -maxdepth 3 | sort');
  const barrels = run("find src -name 'index.ts' -o -name 'index.tsx' | sort");

  return [
    '# Codebase Manifest',
    '',
    '## All TypeScript/TSX files',
    '```',
    files,
    '```',
    '',
    '## Directory tree (depth 3)',
    '```',
    dirs,
    '```',
    '',
    '## Barrel files (index.ts)',
    '```',
    barrels,
    '```',
  ].join('\n');
}

function buildDocsBundle() {
  if (!fs.existsSync(DOCS_DIR)) return '';

  const mdFiles = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.md')) mdFiles.push(full);
    }
  }
  walk(DOCS_DIR);
  mdFiles.sort();

  const parts = [
    '# All Documentation Pages',
    '',
    'Each page is separated by <!-- SOURCE: path --> markers.',
    'Use _docs/_index.json for page IDs when writing back to Notion.',
    '',
  ];

  for (const f of mdFiles) {
    const rel = path.relative(REPO_ROOT, f);
    parts.push('---', '', `<!-- SOURCE: ${rel} -->`, '', fs.readFileSync(f, 'utf8'), '');
  }

  return parts.join('\n');
}

async function prepare() {
  console.log('Phase A: Prepare');

  // 1. Fetch Notion docs
  console.log('  Fetching Notion documentation...');
  execSync(`node ${path.join(SCRIPTS_DIR, 'fetch-notion-docs.js')}`, {
    cwd: REPO_ROOT,
    env: process.env,
    stdio: 'inherit',
  });

  // 2. Generate manifest
  console.log('  Generating codebase manifest...');
  const manifest = generateManifest();
  console.log(`  Manifest: ${manifest.split('\n').length} lines`);

  // 3. Build docs bundle
  console.log('  Bundling documentation...');
  const docsBundle = buildDocsBundle();
  console.log(`  Docs bundle: ${Math.round(docsBundle.length / 1024)}KB`);

  // 4. Read docs index
  let docsIndex = [];
  if (fs.existsSync(DOCS_INDEX_PATH)) {
    docsIndex = JSON.parse(fs.readFileSync(DOCS_INDEX_PATH, 'utf8'));
  }
  console.log(`  Docs index: ${docsIndex.length} pages`);

  return { manifest, docsBundle, docsIndex };
}

// ---------------------------------------------------------------------------
// Phase B: Plan (orchestrator agent)
// ---------------------------------------------------------------------------

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    state: {
      type: 'string',
      enum: ['bootstrap', 'growth', 'maintenance'],
    },
    reasoning: { type: 'string' },
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          action: { type: 'string', enum: ['rewrite', 'create', 'append', 'delete', 'rename', 'split'] },
          page_id: { type: 'string' },
          parent_id: { type: 'string' },
          title: { type: 'string' },
          section: { type: 'string' },
          source_globs: { type: 'array', items: { type: 'string' } },
          current_doc_file: { type: 'string' },
          instructions: { type: 'string' },
          priority: { type: 'integer', minimum: 1, maximum: 3 },
          depends_on: { type: 'array', items: { type: 'string' } },
        },
        required: ['id', 'action', 'section', 'source_globs', 'instructions', 'priority'],
      },
    },
  },
  required: ['state', 'reasoning', 'tasks'],
};

function buildOrchestratorPrompt(manifest, docsBundle, docsIndex) {
  return `You are a documentation planning agent for the Strive learning platform.

## Your job

Analyze the codebase file listing and existing documentation, then produce a structured
plan. Each task in your plan will be executed by an independent worker agent that can
ONLY read files matching the source_globs you assign.

## Documentation philosophy

This is a professional technical wiki for developers and AI agents. Every page must
earn its place. Document architecture decisions, data flows, integration points,
gotchas, and configuration. Do not restate obvious code.

## Determine the documentation state

- **bootstrap** — No or almost no documentation exists. Design the full page hierarchy.
- **growth** — Pages exist but the codebase has outgrown them. New areas need pages,
  large pages need splitting.
- **maintenance** — Pages exist and roughly match the code. Audit for accuracy and drift.

## Task planning rules

- Each task maps to ONE documentation page (one Notion write operation)
- For 'rewrite': include page_id from the docs index
- For 'append': include page_id from the docs index
- For 'create': include parent_id from the docs index (or the technical root ID)
- For 'delete': include page_id — only for pages documenting removed features
- For 'split': create separate child tasks (action: 'create') and one parent task
  (action: 'rewrite') that depends_on the children

## Source glob assignment rules

- Each task's source_globs must cover ALL files relevant to that page
- Use specific patterns: "src/screens/CourseScreen/**/*" not "src/**/*"
- A single file can appear in multiple tasks if relevant to both
- NEVER assign "src/**/*" — that defeats the purpose of splitting
- Target 5-30 files per task. If a glob matches 50+ files, split into multiple tasks.

## Source mapping guide

Use this to assign source_globs:
- Screens → src/screens/<ScreenName>/**/*
- Components → src/components/**/*
- Hooks → src/hooks/**/*
- API Integration → src/api/**/*
- Authentication → src/app/(auth)/**/* + src/hooks/useAuth* + src/middleware.ts + src/app/api/auth/**/*
- Theme → src/theme/**/*
- App routing/layout → src/app/**/page.tsx + src/app/**/layout.tsx
- Validation → src/validation/**/*
- Provider hierarchy → src/app/_registry/**/*
- Config → next.config.* + tsconfig.json + package.json

## Documentation page structure (instruct workers to follow)

Each page should include where applicable:
- Purpose — one paragraph
- How it works — core technical content
- Key files — table of file paths with descriptions
- Integration points — connections to other systems
- Configuration — env vars, feature flags
- Gotchas — non-obvious behavior, limitations

## Inputs

### CODEBASE MANIFEST (all source files)
${manifest}

### CURRENT DOCUMENTATION
${docsBundle || '(No documentation exists — bootstrap mode)'}

### DOCS INDEX (Notion page IDs)
${JSON.stringify(docsIndex, null, 2)}

### TECHNICAL ROOT PAGE ID
${process.env.NOTION_TECHNICAL_ROOT_ID}

## Output

Produce your structured plan. Include clear instructions for each worker explaining
exactly what to document, what to verify, and what the page should cover.
Omit tasks for pages that are already accurate — only include work that needs doing.`;
}

async function orchestrate(manifest, docsBundle, docsIndex) {
  console.log('\nPhase B: Plan');
  console.log('  Running orchestrator agent...');

  const prompt = buildOrchestratorPrompt(manifest, docsBundle, docsIndex);
  console.log(`  Orchestrator prompt: ${Math.round(prompt.length / 1024)}KB`);

  const conversation = query({
    prompt,
    options: {
      model: MODEL,
      maxTurns: 5,
      outputFormat: { type: 'json_schema', schema: PLAN_SCHEMA },
      allowedTools: [],
      permissionMode: 'bypassPermissions',
      allowDangerouslySkipPermissions: true,
      cwd: REPO_ROOT,
    },
  });

  let plan;
  for await (const event of conversation) {
    if (event.type === 'result' && event.subtype === 'success') {
      plan = event.structured_output || JSON.parse(event.result);
    }
  }

  if (!plan || !plan.tasks?.length) {
    console.log('  Orchestrator produced no tasks — documentation is up to date.');
    return { state: 'maintenance', reasoning: 'No changes needed', tasks: [] };
  }

  console.log(`  State: ${plan.state}`);
  console.log(`  Reasoning: ${plan.reasoning}`);
  console.log(`  Tasks: ${plan.tasks.length}`);
  for (const t of plan.tasks) {
    console.log(`    [${t.priority}] ${t.action.padEnd(8)} ${t.section} (${t.source_globs.length} globs)`);
  }

  return plan;
}

// ---------------------------------------------------------------------------
// Phase C: Execute (workers + Notion writes)
// ---------------------------------------------------------------------------

const WORKER_OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    task_id: { type: 'string' },
    action: { type: 'string' },
    markdown: { type: 'string' },
    page_id: { type: 'string' },
    parent_id: { type: 'string' },
    title: { type: 'string' },
    summary: { type: 'string' },
    skipped: { type: 'boolean' },
    skip_reason: { type: 'string' },
  },
  required: ['task_id', 'action', 'markdown', 'summary', 'skipped'],
};

function buildWorkerPrompt(task, manifest) {
  let currentDoc = '';
  if (task.current_doc_file) {
    const docPath = path.join(REPO_ROOT, task.current_doc_file);
    if (fs.existsSync(docPath)) {
      currentDoc = fs.readFileSync(docPath, 'utf8');
    }
  }

  return `You are a documentation writer for the Strive learning platform.
You have ONE job: write complete, accurate documentation for a specific section.

## Your assignment

Section: ${task.section}
Action: ${task.action}
Task ID: ${task.id}

## Instructions from the planner

${task.instructions}

## Current documentation for this page

${currentDoc || '(No existing documentation — write from scratch)'}

## Files you MUST read

Use Glob and Read to find and read files matching these patterns:
${task.source_globs.map((g) => `- ${g}`).join('\n')}

Read EVERY relevant file. Batch 3-5 parallel Read calls per turn.

## Codebase manifest (for reference — shows all files that exist)

${manifest}

## Process

1. Use Glob to find files matching your assigned patterns
2. Read every relevant file
3. Write complete documentation based on what you find in the code

## Writing standards

- Present tense, third person ("The component accepts…")
- Name specific files, components, hooks, endpoints
- Dense and precise — every sentence carries information
- Use code blocks for paths, component names, env vars
- Use tables for structured data (props, routes, env vars)
- Technical, direct, professional tone

## Quality criteria

**COMPLETE**: All public functions, hooks, components, routes in your section documented.
**HELPFUL**: Explains why, not just what. Includes gotchas and integration points.
**TRUTHFUL**: Every file path, function name, prop, and behavior claim matches the code.
If you haven't verified it by reading the source, do not write it.

## Page structure (follow where applicable)

- **Purpose** — one paragraph
- **How it works** — core technical content
- **Key files** — table of file paths with descriptions
- **Integration points** — connections to other systems
- **Configuration** — env vars, feature flags
- **Gotchas** — non-obvious behavior, limitations

## Output

Your structured output must contain:
- task_id: "${task.id}"
- action: "${task.action}"
- markdown: the COMPLETE page content as markdown
- summary: one-line description of what you wrote
- skipped: false (unless the existing docs are already accurate, then true with skip_reason)
${task.page_id ? `- page_id: "${task.page_id}"` : ''}
${task.parent_id ? `- parent_id: "${task.parent_id}"` : ''}
${task.title ? `- title: "${task.title}"` : ''}`;
}

async function runWorkerAgent(task, manifest) {
  const prompt = buildWorkerPrompt(task, manifest);

  try {
    const conversation = query({
      prompt,
      options: {
        model: MODEL,
        maxTurns: WORKER_MAX_TURNS,
        outputFormat: { type: 'json_schema', schema: WORKER_OUTPUT_SCHEMA },
        allowedTools: ['Read', 'Glob', 'Grep'],
        permissionMode: 'bypassPermissions',
        allowDangerouslySkipPermissions: true,
        cwd: REPO_ROOT,
      },
    });

    let result;
    for await (const event of conversation) {
      if (event.type === 'result' && event.subtype === 'success') {
        result = event.structured_output || JSON.parse(event.result);
      }
    }

    if (!result) {
      return {
        task_id: task.id,
        action: task.action,
        markdown: '',
        summary: 'Worker produced no output',
        skipped: true,
        skip_reason: 'No structured output returned',
      };
    }

    // Carry forward Notion IDs from the plan
    result.page_id = result.page_id || task.page_id;
    result.parent_id = result.parent_id || task.parent_id;
    result.title = result.title || task.title;

    return result;
  } catch (err) {
    return {
      task_id: task.id,
      action: task.action,
      markdown: '',
      summary: `Worker error: ${err.message}`,
      skipped: true,
      skip_reason: err.message,
    };
  }
}

async function runTaskBatch(tasks, manifest) {
  const results = [];
  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    console.log(`  Running workers ${i + 1}-${i + batch.length} of ${tasks.length}...`);
    const batchResults = await Promise.all(batch.map((t) => runWorkerAgent(t, manifest)));
    results.push(...batchResults);
  }
  return results;
}

function partitionTasks(tasks) {
  const independent = [];
  const dependent = [];
  for (const t of tasks) {
    if (t.depends_on && t.depends_on.length > 0) {
      dependent.push(t);
    } else {
      independent.push(t);
    }
  }
  // Sort by priority (1 = highest)
  independent.sort((a, b) => a.priority - b.priority);
  dependent.sort((a, b) => a.priority - b.priority);
  return { independent, dependent };
}

function resolveDependencies(dependentTasks, writeLog) {
  // Build map of task_id → created Notion page ID
  const createdIds = {};
  for (const entry of writeLog) {
    if (entry.created_id) {
      createdIds[entry.task_id] = entry.created_id;
    }
  }

  return dependentTasks.map((task) => {
    // Inject created page IDs into instructions
    const resolvedIds = (task.depends_on || [])
      .map((depId) => createdIds[depId] ? `"${depId}" → page ID: ${createdIds[depId]}` : null)
      .filter(Boolean);

    if (resolvedIds.length > 0) {
      task.instructions += `\n\nChild pages created (reference these in the index):\n${resolvedIds.join('\n')}`;
    }

    return task;
  });
}

// ---------------------------------------------------------------------------
// Notion write pass
// ---------------------------------------------------------------------------

function writeToNotion(results) {
  const writeLog = [];

  for (const result of results) {
    if (result.skipped) {
      writeLog.push({ task_id: result.task_id, status: 'skipped', reason: result.skip_reason });
      console.log(`    ○ ${result.task_id}: skipped — ${result.skip_reason}`);
      continue;
    }

    if (!result.markdown || result.markdown.trim().length === 0) {
      writeLog.push({ task_id: result.task_id, status: 'skipped', reason: 'Empty markdown' });
      console.log(`    ○ ${result.task_id}: skipped — empty markdown`);
      continue;
    }

    // Write markdown to temp file
    const tmpFile = `/tmp/doc_${result.task_id.replace(/[^a-z0-9_-]/gi, '_')}.md`;
    fs.writeFileSync(tmpFile, result.markdown);

    const env = { ...process.env };
    const tool = `node ${NOTION_TOOL}`;

    try {
      let output;
      switch (result.action) {
        case 'rewrite':
          output = execSync(`${tool} rewrite ${result.page_id} ${tmpFile}`, { env, encoding: 'utf8' });
          writeLog.push({ task_id: result.task_id, status: 'success', action: 'rewrite' });
          break;

        case 'append':
          output = execSync(`${tool} append ${result.page_id} ${tmpFile}`, { env, encoding: 'utf8' });
          writeLog.push({ task_id: result.task_id, status: 'success', action: 'append' });
          break;

        case 'create': {
          const title = result.title.replace(/"/g, '\\"');
          output = execSync(`${tool} create ${result.parent_id} "${title}" ${tmpFile}`, { env, encoding: 'utf8' });
          const match = output.match(/\[([a-f0-9-]+)\]/);
          const createdId = match ? match[1] : null;
          writeLog.push({ task_id: result.task_id, status: 'success', action: 'create', created_id: createdId });
          break;
        }

        case 'delete':
          output = execSync(`${tool} delete ${result.page_id}`, { env, encoding: 'utf8' });
          writeLog.push({ task_id: result.task_id, status: 'success', action: 'delete' });
          break;

        case 'rename': {
          const newTitle = result.title.replace(/"/g, '\\"');
          output = execSync(`${tool} rename ${result.page_id} "${newTitle}"`, { env, encoding: 'utf8' });
          writeLog.push({ task_id: result.task_id, status: 'success', action: 'rename' });
          break;
        }

        default:
          writeLog.push({ task_id: result.task_id, status: 'skipped', reason: `Unknown action: ${result.action}` });
          continue;
      }

      console.log(`    ✓ ${result.task_id}: ${result.action} — ${result.summary}`);
    } catch (err) {
      writeLog.push({ task_id: result.task_id, status: 'error', error: err.message });
      console.log(`    ✗ ${result.task_id}: ${result.action} — ${err.message}`);
    }
  }

  return writeLog;
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

function printSummary(plan, allWriteResults) {
  const succeeded = allWriteResults.filter((r) => r.status === 'success').length;
  const skipped = allWriteResults.filter((r) => r.status === 'skipped').length;
  const failed = allWriteResults.filter((r) => r.status === 'error').length;

  console.log('\n' + '='.repeat(60));
  console.log('REBUILD SUMMARY');
  console.log('='.repeat(60));
  console.log(`State:     ${plan.state}`);
  console.log(`Reasoning: ${plan.reasoning}`);
  console.log(`Tasks:     ${plan.tasks.length} planned`);
  console.log(`Results:   ${succeeded} succeeded, ${skipped} skipped, ${failed} failed`);
  console.log('='.repeat(60));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const startTime = Date.now();

  // Phase A
  const { manifest, docsBundle, docsIndex } = await prepare();

  // Phase B
  const plan = await orchestrate(manifest, docsBundle, docsIndex);

  if (plan.tasks.length === 0) {
    console.log('\nNo tasks to execute. Documentation is up to date.');
    return;
  }

  // Phase C
  console.log('\nPhase C: Execute');
  const { independent, dependent } = partitionTasks(plan.tasks);

  console.log(`  Independent tasks: ${independent.length}`);
  console.log(`  Dependent tasks: ${dependent.length}`);

  // Run independent workers
  console.log('\n  --- Independent workers ---');
  const independentResults = await runTaskBatch(independent, manifest);

  // Write independent results to Notion
  console.log('\n  --- Writing independent results to Notion ---');
  const writeLog = writeToNotion(independentResults);

  // Run dependent workers (if any)
  let allWriteResults = [...writeLog];
  if (dependent.length > 0) {
    console.log('\n  --- Dependent workers ---');
    const resolved = resolveDependencies(dependent, writeLog);
    const dependentResults = await runTaskBatch(resolved, manifest);

    console.log('\n  --- Writing dependent results to Notion ---');
    const depWriteLog = writeToNotion(dependentResults);
    allWriteResults.push(...depWriteLog);
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\nCompleted in ${elapsed}s`);
  printSummary(plan, allWriteResults);
}

main().catch((err) => {
  console.error(`Rebuild failed: ${err.message}`);
  process.exit(1);
});
