export function isRequestDemoLabel(label: string) {
  const normalized = label.trim();
  return (
    /^request\s+(a\s+)?demo$/i.test(normalized) ||
    /^contact\s+us$/i.test(normalized)
  );
}
