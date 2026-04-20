type Format = 'short' | 'long' | 'cell';

// Date inputs in this app are almost always yyyy-mm-dd strings. We append a
// zero-time suffix so `new Date()` interprets them in local time instead of UTC.
const parse = (input: Date | string) =>
  typeof input === 'string' ? new Date(input.includes('T') ? input : `${input}T00:00:00`) : input;

export const formatDate = ({ input, format = 'short' }: { input: Date | string; format?: Format }) => {
  const date = parse(input);
  switch (format) {
    case 'long':
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    case 'cell':
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    default:
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};
