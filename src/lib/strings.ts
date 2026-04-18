export const plural = ({ count, singular, many }: { count: number; singular: string; many?: string }) =>
  count === 1 ? singular : many ?? `${singular}s`;
