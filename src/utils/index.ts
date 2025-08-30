export function formatCompact(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return "0";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const units = [
    { v: 1e12, s: "t" },
    { v: 1e9, s: "b" },
    { v: 1e6, s: "m" },
    { v: 1e3, s: "k" },
  ];

  const strip = (n: number) => n.toFixed(decimals).replace(/\.0+$|(\.\d*[1-9])0+$/, "$1");

  for (let i = 0; i < units.length; i++) {
    if (abs >= units[i].v) {
      const n = Number((abs / units[i].v).toFixed(decimals));
      if (n >= 1000 && i > 0) {
        const n2 = Number((abs / units[i - 1].v).toFixed(decimals));
        return `${sign}${strip(n2)}${units[i - 1].s}`;
      }
      return `${sign}${strip(n)}${units[i].s}`;
    }
  }
  return `${sign}${strip(abs)}`;
}
