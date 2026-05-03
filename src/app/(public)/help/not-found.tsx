import { getAllTopics } from '@/lib/kb';
import { KbNotFoundScreen } from '@/screens/KbScreen';

export default function HelpNotFound() {
  return <KbNotFoundScreen topics={getAllTopics()} />;
}
