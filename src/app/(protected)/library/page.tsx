import { redirect } from 'next/navigation';

/**
 * Library lives inline on the home screen as an expandable section. The
 * standalone route is kept as a redirect so any external bookmarks /
 * deep links land in the right place.
 */
export default function LibraryPage() {
  redirect('/');
}
