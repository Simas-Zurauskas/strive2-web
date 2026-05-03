import { TextLoader } from '@/components/TextLoader/TextLoader';

export default function ProtectedLoading() {
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
