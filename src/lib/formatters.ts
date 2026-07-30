export function fmt(n: number | null | undefined, d = 0): string {
  if (n == null) return '-';
  return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function fmtM(n: number | null | undefined): string {
  if (n == null) return '-';
  if (Math.abs(n) >= 1e9) return '$' + fmt(n / 1e9, 1) + 'B';
  if (Math.abs(n) >= 1e6) return '$' + fmt(n / 1e6, 1) + 'M';
  if (Math.abs(n) >= 1e3) return '$' + fmt(n / 1e3, 1) + 'K';
  return '$' + fmt(n, 0);
}

export function pct(n: number | null | undefined): string {
  if (n == null) return '-%';
  return (n * 100).toFixed(1) + '%';
}
