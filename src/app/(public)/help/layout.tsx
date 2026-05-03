import { KbChatPanel } from '@/components';

/**
 * Wraps every page under /help. Mounting the chat widget here means a
 * single instance survives navigation between articles, so a learner
 * can open the FAB on the hub, navigate into an article, and continue
 * the same conversation. Page-level state (URLs, scroll, etc.) still
 * resets per route — only the chat panel persists.
 */
export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <KbChatPanel />
    </>
  );
}
