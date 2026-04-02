/**
 * notion-tool.js — CLI for Claude Code to manage Notion documentation pages.
 *
 * Usage:
 *   node notion-tool.js list
 *   node notion-tool.js rewrite <page_id> <markdown_file>
 *   node notion-tool.js append <page_id> <markdown_file>
 *   node notion-tool.js create <parent_id> "<title>" <markdown_file>
 *   node notion-tool.js delete <page_id>
 *   node notion-tool.js rename <page_id> "<new_title>"
 *
 * Markdown files are converted to Notion blocks automatically.
 * Requires NOTION_API_KEY and NOTION_TECHNICAL_ROOT_ID env vars.
 */

const fs = require('fs');
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// ---------------------------------------------------------------------------
// Markdown → Notion blocks
// ---------------------------------------------------------------------------

function parseInlineRichText(text) {
  const segments = [];
  // Order matters: bold (**) before italic (*), then code, then links
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        text: { content: text.slice(lastIndex, match.index) },
      });
    }

    if (match[2]) {
      segments.push({
        type: 'text',
        text: { content: match[2] },
        annotations: { bold: true },
      });
    } else if (match[4]) {
      segments.push({
        type: 'text',
        text: { content: match[4] },
        annotations: { italic: true },
      });
    } else if (match[6]) {
      segments.push({
        type: 'text',
        text: { content: match[6] },
        annotations: { code: true },
      });
    } else if (match[7] && match[8]) {
      segments.push({
        type: 'text',
        text: { content: match[7], link: { url: match[8] } },
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      text: { content: text.slice(lastIndex) },
    });
  }

  return segments.length ? segments : [{ type: 'text', text: { content: text } }];
}

function richText(text) {
  return parseInlineRichText(text);
}

function plainRichText(text) {
  return [{ type: 'text', text: { content: text } }];
}

function markdownToBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: { rich_text: richText(line.slice(4)) },
      });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText(line.slice(3)) },
      });
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: richText(line.slice(2)) },
      });
      i++;
      continue;
    }

    // Divider
    if (/^---+$/.test(line.trim())) {
      blocks.push({ object: 'block', type: 'divider', divider: {} });
      i++;
      continue;
    }

    // Code block
    if (line.trimStart().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || 'plain text';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const content = codeLines.join('\n');
      // Notion has a 2000-char limit per rich_text segment
      const chunks = [];
      for (let c = 0; c < content.length; c += 2000) {
        chunks.push({ type: 'text', text: { content: content.slice(c, c + 2000) } });
      }
      blocks.push({
        object: 'block',
        type: 'code',
        code: { rich_text: chunks.length ? chunks : plainRichText(''), language: lang },
      });
      continue;
    }

    // Bullet list item
    if (/^[-*] /.test(line)) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: richText(line.replace(/^[-*] /, '')) },
      });
      i++;
      continue;
    }

    // Numbered list item
    if (/^\d+\. /.test(line)) {
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: richText(line.replace(/^\d+\. /, '')) },
      });
      i++;
      continue;
    }

    // Callout (> ⚠️ or > 💡 or > ℹ️ — emoji at start of blockquote)
    if (/^> ./.test(line)) {
      const content = line.slice(2);
      const emojiMatch = content.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)\s*/u);
      if (emojiMatch) {
        blocks.push({
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: richText(content.slice(emojiMatch[0].length)),
            icon: { type: 'emoji', emoji: emojiMatch[1] },
          },
        });
      } else {
        blocks.push({
          object: 'block',
          type: 'quote',
          quote: { rich_text: richText(content) },
        });
      }
      i++;
      continue;
    }

    // Table (lines starting with |)
    if (line.trimStart().startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trimStart().startsWith('|')) {
        const row = lines[i].trim();
        // Skip separator rows like | --- | --- |
        if (!/^\|[\s-:|]+\|$/.test(row)) {
          tableLines.push(row);
        }
        i++;
      }
      if (tableLines.length > 0) {
        const parseRow = (row) =>
          row
            .split('|')
            .slice(1, -1) // remove empty first/last from leading/trailing |
            .map((cell) => cell.trim());

        const rows = tableLines.map(parseRow);
        const colCount = Math.max(...rows.map((r) => r.length));

        blocks.push({
          object: 'block',
          type: 'table',
          table: {
            table_width: colCount,
            has_column_header: true,
            children: rows.map((cells) => ({
              object: 'block',
              type: 'table_row',
              table_row: {
                cells: Array.from({ length: colCount }, (_, ci) =>
                  richText(cells[ci] || '')
                ),
              },
            })),
          },
        });
      }
      continue;
    }

    // Regular paragraph — collect consecutive non-block lines
    const paraLines = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !lines[i].startsWith('> ') &&
      !/^---+$/.test(lines[i].trim()) &&
      !lines[i].trimStart().startsWith('|')
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    const joined = paraLines.join('\n');
    // Notion paragraph rich_text has a 2000-char limit per segment
    const rt = richText(joined);
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: rt },
    });
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Notion operations
// ---------------------------------------------------------------------------

async function listPages() {
  const rootId = process.env.NOTION_TECHNICAL_ROOT_ID;
  if (!rootId) throw new Error('NOTION_TECHNICAL_ROOT_ID is required');

  const pages = [];
  async function walk(blockId, path = '') {
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
          await walk(block.id, fullPath);
        }
      }
      cursor = res.next_cursor;
    } while (cursor);
  }

  await walk(rootId);
  console.log(JSON.stringify(pages, null, 2));
}

async function appendBlocks(pageId, blocks) {
  // Notion limits to 100 blocks per request
  for (let i = 0; i < blocks.length; i += 100) {
    await notion.blocks.children.append({
      block_id: pageId,
      children: blocks.slice(i, i + 100),
    });
  }
}

async function rewritePage(pageId, markdownFile) {
  const markdown = fs.readFileSync(markdownFile, 'utf8');
  const blocks = markdownToBlocks(markdown);

  // Delete all existing blocks
  let cursor;
  do {
    const res = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const block of res.results) {
      try {
        await notion.blocks.delete({ block_id: block.id });
      } catch (_) {
        // Some block types can't be deleted
      }
    }
    cursor = res.next_cursor;
  } while (cursor);

  await appendBlocks(pageId, blocks);
  console.log(`✓ Rewrote page ${pageId} (${blocks.length} blocks)`);
}

async function appendToPage(pageId, markdownFile) {
  const markdown = fs.readFileSync(markdownFile, 'utf8');
  const blocks = markdownToBlocks(markdown);
  await appendBlocks(pageId, blocks);
  console.log(`✓ Appended to page ${pageId} (${blocks.length} blocks)`);
}

async function createPage(parentId, title, markdownFile) {
  const markdown = fs.readFileSync(markdownFile, 'utf8');
  const blocks = markdownToBlocks(markdown);

  // Notion limits children in create to 100
  const initialBlocks = blocks.slice(0, 100);
  const page = await notion.pages.create({
    parent: { page_id: parentId },
    properties: {
      title: { title: [{ type: 'text', text: { content: title } }] },
    },
    children: initialBlocks,
  });

  // Append remaining blocks if any
  if (blocks.length > 100) {
    await appendBlocks(page.id, blocks.slice(100));
  }

  console.log(`✓ Created page "${title}" [${page.id}] under ${parentId} (${blocks.length} blocks)`);
}

async function deletePage(pageId) {
  await notion.pages.update({
    page_id: pageId,
    archived: true,
  });
  console.log(`✓ Archived page ${pageId}`);
}

async function renamePage(pageId, newTitle) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      title: { title: [{ type: 'text', text: { content: newTitle } }] },
    },
  });
  console.log(`✓ Renamed page ${pageId} to "${newTitle}"`);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main() {
  const [, , command, ...args] = process.argv;

  switch (command) {
    case 'list':
      await listPages();
      break;

    case 'rewrite':
      if (args.length < 2) throw new Error('Usage: rewrite <page_id> <markdown_file>');
      await rewritePage(args[0], args[1]);
      break;

    case 'append':
      if (args.length < 2) throw new Error('Usage: append <page_id> <markdown_file>');
      await appendToPage(args[0], args[1]);
      break;

    case 'create':
      if (args.length < 3) throw new Error('Usage: create <parent_id> "<title>" <markdown_file>');
      await createPage(args[0], args[1], args[2]);
      break;

    case 'delete':
      if (args.length < 1) throw new Error('Usage: delete <page_id>');
      await deletePage(args[0]);
      break;

    case 'rename':
      if (args.length < 2) throw new Error('Usage: rename <page_id> "<new_title>"');
      await renamePage(args[0], args[1]);
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.error('Commands: list, rewrite, append, create, delete, rename');
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`✗ ${err.message}`);
  process.exit(1);
});
