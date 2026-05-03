import { TextLoader } from '@/components/TextLoader/TextLoader';

// Default loading UI for the root segment. Per-route-group loading.tsx files
// override this for their subtrees.
export default function RootLoading() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextLoader />
    </div>
  );
}
