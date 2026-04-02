const fs = require('fs');
const Anthropic = require('@anthropic-ai/sdk');
const { Client } = require('@notionhq/client');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// ---------------------------------------------------------------------------
// Notion helpers
// ---------------------------------------------------------------------------

async function fetchPageTree(blockId, path = '') {
  const pages = [];
  let cursor;
  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const block of res.results) {
      if (block.type === 'child_page') {
        const title = block.child_page.title;
        const fullPath = path ? `${path} > ${title}` : title;
        pages.push({ id: block.id, title, path: fullPath });
        const children = await fetchPageTree(block.id, fullPath);
        pages.push(...children);
      }
    }
    cursor = res.next_cursor;
  } while (cursor);
  return pages;
}

function textBlock(content) {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: { rich_text: [{ type: 'text', text: { content } }] },
  };
}

function heading3Block(content) {
  return {
    object: 'block',
    type: 'heading_3',
    heading_3: { rich_text: [{ type: 'text', text: { content } }] },
  };
}

function metaBlock(text) {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [{ type: 'text', text: { content: text }, annotations: { color: 'gray', italic: true } }],
    },
  };
}

function divider() {
  return { object: 'block', type: 'divider', divider: {} };
}

function prMeta() {
  return `PR #${process.env.PR_NUMBER} by ${process.env.PR_AUTHOR} · ${new Date().toISOString().split('T')[0]}`;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

async function updatePage(pageId, _pageTitle, content) {
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      divider(),
      heading3Block(`PR #${process.env.PR_NUMBER}: ${process.env.PR_TITLE}`),
      textBlock(content),
      metaBlock(prMeta()),
    ],
  });
}

async function correctPage(pageId, _pageTitle, staleSection, correctedContent) {
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      divider(),
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `Outdated as of PR #${process.env.PR_NUMBER}: "${staleSection}"\n\nCorrected:\n${correctedContent}`,
              },
            },
          ],
          icon: { type: 'emoji', emoji: '⚠️' },
          color: 'yellow_background',
        },
      },
      metaBlock(prMeta()),
    ],
  });
}

async function createPage(parentId, title, content, linksTo = []) {
  const children = [textBlock(content)];

  if (linksTo.length > 0) {
    children.push(metaBlock(`Related pages: ${linksTo.join(', ')}`));
  }
  children.push(metaBlock(`Created: ${prMeta()}`));

  const page = await notion.pages.create({
    parent: { page_id: parentId },
    properties: { title: { title: [{ type: 'text', text: { content: title } }] } },
    children,
  });
  return page.id;
}

async function crosslinkPage(pageId, _pageTitle, note) {
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      divider(),
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [
            {
              type: 'text',
              text: { content: `Cross-repo update (PR #${process.env.PR_NUMBER}): ${note}` },
            },
          ],
          icon: { type: 'emoji', emoji: '🔗' },
          color: 'blue_background',
        },
      },
      metaBlock(prMeta()),
    ],
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const rootId = process.env.NOTION_TECHNICAL_ROOT_ID;
  if (!rootId) throw new Error('NOTION_TECHNICAL_ROOT_ID is required');

  const diff = fs.readFileSync('/tmp/pr_diff.txt', 'utf8');

  console.log('Fetching Notion page tree…');
  const existingPages = await fetchPageTree(rootId);
  console.log(`Found ${existingPages.length} existing pages`);

  const prompt = `You are a documentation agent for Strive — an AI-powered personalized learning platform.

PLATFORM ARCHITECTURE
Strive consists of two independent repositories:
- **API** (Express 5, Node 22, MongoDB, LangGraph) — REST API, authentication, AI-powered course generation
- **Client** (Next.js 16, React 19, styled-components, NextAuth) — web application with course creation wizard, lesson viewer, AI chat

They communicate via REST (OpenAPI contract) and WebSocket (Socket.IO for job events). Types are shared through Swagger → openapi-typescript codegen.

YOU ARE IN THE CLIENT REPOSITORY. This PR affects the Next.js frontend only.

DOCUMENTATION STRUCTURE
All documentation lives in Notion under two top-level sections:
- **Product** — manually curated vision, features, and strategy docs. NEVER modify these.
- **Technical** — architecture, conventions, and implementation docs. This is your scope.

The Technical section you can update:
${existingPages.map((p) => `- "${p.title}" (${p.path}) [${p.id}]`).join('\n') || '(empty — first sync)'}

Technical root page ID: ${rootId}

PR CONTEXT
Repository: ${process.env.REPO_NAME}
PR #${process.env.PR_NUMBER}: ${process.env.PR_TITLE}
Author: ${process.env.PR_AUTHOR}
Description: ${process.env.PR_BODY || 'None provided'}

Changed files:
${process.env.CHANGED_FILES}

Diff (truncated):
${diff}

DOCUMENTATION RULES
1. You maintain a professional technical wiki — not a changelog. Every update must be useful to a developer joining the project tomorrow.
2. Only update the **Technical** section. Never touch Product pages.
3. Focus on changes that affect: component APIs and props, screen behavior, auth flow, API integration patterns, routing, provider hierarchy, theme system, conventions, or cross-repo contracts.
4. Skip trivial changes: dependency bumps, formatting, minor CSS tweaks, test-only changes, internal refactors that don't change public APIs.
5. When an existing page describes something this PR changed, use "correct" to flag the stale section — don't just append.
6. Only "create" a new page when the PR introduces a genuinely new subsystem or pattern with no existing home.
7. Place new pages under the correct parent in the hierarchy (e.g., client-specific docs under the Client section).
8. Use "crosslink" when a client change affects the API contract or shared integration points (auth, WebSocket events, type generation).

WRITING STYLE
- Write in present tense, third person ("The component accepts…", "Authentication uses…")
- Be specific: name files, components, hooks, endpoints. No generic summaries.
- 2–6 sentences per update. Dense and precise, not verbose.
- Match the existing documentation tone: technical, direct, no fluff.

Respond ONLY in valid JSON (no markdown fences):
{
  "meaningful": boolean,
  "reasoning": "One sentence: why this PR does or does not warrant doc updates",
  "actions": [
    {
      "type": "update",
      "page_id": "id",
      "page_title": "title",
      "content": "Specific content to append"
    },
    {
      "type": "correct",
      "page_id": "id",
      "page_title": "title",
      "stale_section": "Which section is now outdated",
      "corrected_content": "What it should say instead"
    },
    {
      "type": "create",
      "parent_id": "id",
      "title": "New Page Title",
      "content": "Page content",
      "links_to": ["related-page-id"]
    },
    {
      "type": "crosslink",
      "page_id": "id",
      "page_title": "title",
      "note": "What changed and why the other section should know"
    }
  ]
}`;

  console.log('Asking Claude to assess documentation impact…');
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  });

  let result;
  try {
    const raw = response.content[0].text.replace(/```json|```/g, '').trim();
    result = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse Claude response:', response.content[0].text);
    throw new Error(`JSON parse error: ${err.message}`);
  }

  console.log(`Meaningful: ${result.meaningful}`);
  console.log(`Reasoning: ${result.reasoning}`);

  if (!result.meaningful || !result.actions?.length) {
    console.log('No documentation updates needed.');
    return;
  }

  console.log(`Executing ${result.actions.length} action(s)…`);

  for (const action of result.actions) {
    try {
      switch (action.type) {
        case 'update':
          console.log(`  Updating: "${action.page_title}"`);
          await updatePage(action.page_id, action.page_title, action.content);
          console.log(`  ✓ Updated`);
          break;
        case 'correct':
          console.log(`  Correcting: "${action.page_title}" — ${action.stale_section}`);
          await correctPage(action.page_id, action.page_title, action.stale_section, action.corrected_content);
          console.log(`  ✓ Correction flagged`);
          break;
        case 'create':
          console.log(`  Creating: "${action.title}"`);
          const newId = await createPage(action.parent_id, action.title, action.content, action.links_to || []);
          console.log(`  ✓ Created (${newId})`);
          break;
        case 'crosslink':
          console.log(`  Cross-linking: "${action.page_title}"`);
          await crosslinkPage(action.page_id, action.page_title, action.note);
          console.log(`  ✓ Cross-link added`);
          break;
        default:
          console.log(`  Skipping unknown action type: ${action.type}`);
      }
    } catch (err) {
      console.error(`  ✗ Failed ${action.type} on "${action.page_title || action.title}": ${err.message}`);
    }
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
