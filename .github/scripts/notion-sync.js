const fs = require('fs');
const Anthropic = require('@anthropic-ai/sdk');
const { Client } = require('@notionhq/client');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const notion = new Client({ auth: process.env.NOTION_API_KEY });

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

async function createNotionPage(parentId, title, content, linksTo = []) {
  const children = [
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content } }],
      },
    },
  ];

  if (linksTo.length > 0) {
    children.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: `Related pages: ${linksTo.join(', ')}` },
            annotations: { italic: true },
          },
        ],
      },
    });
  }

  children.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: `Last updated: PR #${process.env.PR_NUMBER} · ${process.env.REPO_NAME} · ${new Date().toISOString().split('T')[0]}`,
          },
          annotations: { color: 'gray', italic: true },
        },
      ],
    },
  });

  const page = await notion.pages.create({
    parent: { page_id: parentId },
    properties: {
      title: { title: [{ type: 'text', text: { content: title } }] },
    },
    children,
  });
  return page.id;
}

async function appendToPage(pageId, prTitle, content) {
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: `PR #${process.env.PR_NUMBER}: ${prTitle}` } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [{ type: 'text', text: { content } }] },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `${process.env.PR_AUTHOR} · ${process.env.REPO_NAME} · ${new Date().toISOString().split('T')[0]}`,
              },
              annotations: { color: 'gray', italic: true },
            },
          ],
        },
      },
    ],
  });
}

async function correctPage(pageId, pageTitle, staleSection, correctedContent) {
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `⚠️ Section outdated as of PR #${process.env.PR_NUMBER}: "${staleSection}"\n\nCorrected: ${correctedContent}\n\nUpdated: ${new Date().toISOString().split('T')[0]}`,
              },
            },
          ],
          icon: { type: 'emoji', emoji: '⚠️' },
          color: 'yellow_background',
        },
      },
    ],
  });
}

async function crosslinkPage(pageId, pageTitle, note) {
  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      { object: 'block', type: 'divider', divider: {} },
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `🔗 Cross-repo update from ${process.env.REPO_NAME} (PR #${process.env.PR_NUMBER}): ${note}`,
              },
            },
          ],
          icon: { type: 'emoji', emoji: '🔗' },
          color: 'blue_background',
        },
      },
    ],
  });
}

async function main() {
  const rootId = process.env.NOTION_DOCS_ROOT_PAGE_ID;
  const diff = fs.readFileSync('/tmp/pr_diff.txt', 'utf8');

  console.log('Fetching Notion page tree...');
  const existingPages = await fetchPageTree(rootId);
  console.log(`Found ${existingPages.length} existing pages`);

  const prompt = `You are a living documentation agent maintaining a structured technical wiki.
A PR was just merged and you must reason about its documentation impact with the same care a senior engineer would.

Repo: ${process.env.REPO_NAME}
Repo description: ${process.env.REPO_DESCRIPTION}
PR #${process.env.PR_NUMBER}: ${process.env.PR_TITLE}
PR description: ${process.env.PR_BODY || 'None'}
Changed files:
${process.env.CHANGED_FILES}

Diff (partial):
${diff}

Current wiki structure (title | path | id):
${existingPages.map((p) => `- "${p.title}" | ${p.path} | ${p.id}`).join('\n') || 'None yet — this may be the first PR'}

Root page ID (use as parent for top-level pages): ${rootId}

---

DOCUMENTATION PHILOSOPHY

You are maintaining a professional technical wiki — not a changelog. Every update must earn its place.
Ask yourself: would a developer joining this project tomorrow find this useful, or is it noise?

Your thinking must go beyond this single PR. Consider:
- What does this change mean architecturally?
- Does this affect how repos integrate with each other?
- Does this change a data contract, API shape, auth flow, or deployment concern other repos depend on?
- Is there an existing page that now contains outdated information that must be corrected — not just appended to?

---

ACTIONS AVAILABLE

1. update — Append meaningful new content to an existing page. Write 2-6 sentences that are specific and useful. Never write generic summaries — say exactly what changed and why it matters.

2. correct — Use when a PR changes something the docs now describe incorrectly. Provide what section is stale and what the corrected content should say.

3. create — Create a new page only when the PR introduces a concept, system, or integration that genuinely has no home. Place it correctly in the hierarchy using the right parent_id from the existing tree.

4. crosslink — Use when an update in this repo has implications for another repo's documentation. Return the page_id that should receive a cross-link note.

5. skip — If the PR is trivial (typo, dep bump, config tweak, formatting) or internal implementation detail that does not affect how the system is understood or integrated.

---

CROSS-REPOSITORY THINKING

If the PR changes an API contract or endpoint shape → the consuming repo's docs need a crosslink note.
If it changes an auth mechanism → architecture/auth page needs updating, not just this repo's page.
If it changes a shared data model → the cross-repo architecture section is the right home.
If it introduces a new deployment dependency → deployment-topology docs need updating.

---

HIERARCHY RULES

- Changes to a specific repo's internals → under that repo's section
- Changes to how two repos communicate → under architecture/
- New external service integration → under architecture/ or the relevant repo depending on scope
- Auth changes → under architecture/auth/ if cross-repo, under repo/auth/ if isolated
- Never create a page at root level unless it is a genuinely top-level architectural concern

---

Respond ONLY in valid JSON, no markdown fences:
{
  "meaningful": true,
  "reasoning": "Your architectural assessment of this PR's documentation impact",
  "cross_repo_impact": true,
  "actions": [
    {
      "type": "update",
      "page_id": "existing-page-id",
      "page_title": "Page Title",
      "content": "Specific, useful content to append"
    },
    {
      "type": "correct",
      "page_id": "existing-page-id",
      "page_title": "Page Title",
      "stale_section": "Which section is now outdated",
      "corrected_content": "What it should say now"
    },
    {
      "type": "create",
      "parent_id": "parent-page-id",
      "title": "New Page Title",
      "content": "First-draft page content written as living documentation",
      "links_to": ["page-id-1", "page-id-2"]
    },
    {
      "type": "crosslink",
      "page_id": "page-in-another-repo-section",
      "page_title": "That Page Title",
      "note": "What cross-link note to add"
    }
  ]
}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = response.content[0].text.replace(/```json|```/g, '').trim();
  const result = JSON.parse(raw);

  console.log(`Meaningful: ${result.meaningful}`);
  console.log(`Reasoning: ${result.reasoning}`);
  console.log(`Cross-repo impact: ${result.cross_repo_impact}`);

  if (!result.meaningful || !result.actions?.length) {
    console.log('No documentation updates needed.');
    return;
  }

  for (const action of result.actions) {
    if (action.type === 'update') {
      console.log(`Updating: "${action.page_title}"`);
      await appendToPage(action.page_id, process.env.PR_TITLE, action.content);
      console.log('✓ Updated');
    } else if (action.type === 'correct') {
      console.log(`Correcting: "${action.page_title}"`);
      await correctPage(action.page_id, action.page_title, action.stale_section, action.corrected_content);
      console.log('✓ Correction flagged');
    } else if (action.type === 'create') {
      console.log(`Creating: "${action.title}"`);
      const newId = await createNotionPage(action.parent_id, action.title, action.content, action.links_to || []);
      console.log(`✓ Created (${newId})`);
    } else if (action.type === 'crosslink') {
      console.log(`Cross-linking: "${action.page_title}"`);
      await crosslinkPage(action.page_id, action.page_title, action.note);
      console.log('✓ Cross-link added');
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
