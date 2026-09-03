import { getAllTopics } from '@/lib/kb';
import { KbNotFoundScreen } from '@/screens/KbScreen';

/**
 * Help-scoped 404. KEPT DELIBERATELY, but currently unreachable — read this
 * before assuming it is live.
 *
 * `export const dynamicParams = false` on /help/[topic] and
 * /help/[topic]/[slug] rejects an unlisted param at the ROUTING layer, so the
 * segment never renders, the `notFound()` calls inside those pages never run,
 * and this boundary is never entered. Since 006 the 404 those routes actually
 * produce is the root `app/not-found.tsx`, which carries its own chrome
 * because a root 404 enters no route-group layout.
 *
 * Kept rather than deleted because reviving it is a one-line change: drop the
 * two `dynamicParams = false` exports and a lost visitor lands here inside the
 * (public) + help layouts, with the topic grid and the KbChatPanel. The cost
 * of that revival is that /help/<anything>/<anything> becomes a dynamic render
 * per request instead of a router-level rejection — an owner-level call, not a
 * side effect of a mobile fix.
 */
export default function HelpNotFound() {
  return <KbNotFoundScreen topics={getAllTopics()} />;
}
