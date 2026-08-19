import type { Announcement } from '@/lib/announcements/list';

/**
 * In-app announcements, newest first (the panel sorts, so the order here is
 * only for whoever is reading this file).
 *
 * Hardcoded on purpose. Two consequences worth knowing before adding to it:
 *
 *  - Every entry ships in the JS bundle, so a new announcement needs a deploy.
 *  - `key` is the seen-state key, persisted in the reader's browser. **Never
 *    reuse, renumber or edit a key.** Changing one makes the announcement
 *    unread again for everyone who has already read it; reusing an old one
 *    hides a new announcement from everyone who read its predecessor.
 *
 * `image` is optional. `src` is a path under `public/`, and `width`/`height`
 * are the file's real intrinsic dimensions — `next/image` needs them to
 * reserve the space so the panel does not jump as the image decodes.
 *
 * The illustrations under `public/images/announcements/` are composed from
 * real captures of the running product, not mockups: an actual exported PDF
 * page, the actual narration menu, the actual source-material step. What a
 * reader sees here is what they meet when they go and use it. The compositor
 * that builds them is kept at
 * `wiki-strive/tasks/002-in-app-announcements-panel/visuals-src/compose.py`.
 */
export const ANNOUNCEMENTS: readonly Announcement[] = [
  {
    key: '2026-08-downloads',
    date: '2026-08-19',
    title: 'Take a course with you',
    image: {
      src: '/images/announcements/downloads.png',
      alt: 'A lesson exported as a PDF page, beside the narration player with its download menu open',
      width: 1000,
      height: 600,
    },
    body: [
      'Your courses no longer have to stay in the browser.',
      '',
      'Any lesson now downloads as a **typeset PDF** — hero image, diagrams redrawn as sharp vector artwork, maths, code and the reading list, with every link still live. The same button on a course overview binds the **whole course** into one document, opening on a contents page you can click straight through to any lesson.',
      '',
      'Where a lesson has narration, the player offers the **audio file** and a **plain-text transcript** alongside it — one to listen to, one to search, quote or read at your own pace.',
      '',
      'Quizzes and interactive exercises stay in the app, where they can still ask you something. [How a lesson is built](/help/building-and-studying/lesson-blocks-and-content) covers what a PDF carries and what it leaves behind.',
    ].join('\n'),
  },
  {
    key: '2026-07-your-materials',
    date: '2026-07-24',
    title: 'Build a course from your own material',
    image: {
      src: '/images/announcements/your-materials.png',
      alt: 'The source-material step of the course wizard, with a file drop zone and an article link added',
      width: 1000,
      height: 600,
    },
    body: [
      'Until now a course began with a sentence about what you wanted to learn. It can now begin with what you already have.',
      '',
      'Bring documents — notes, books, slides, spreadsheets, recordings — or paste links to articles you want covered. Strive reads them, tells you **what they can teach before anything is generated**, and builds the course on top of them.',
      '',
      'Lessons grounded in your sources are marked as such, so you can always see which parts came from your material and which Strive added around it.',
      '',
      '[Build a course from your own documents](/help/building-and-studying/build-a-course-from-your-documents) walks through what is accepted and how the analysis works.',
    ].join('\n'),
  },
];
