// ---------- Exports ----------
function buildCssExports(colors: Array<{ hexCode: string; hexName?: string | null }>) {
  let idx = 0;

  const safeName = (name?: string | null) => {
    const raw = (name && name.trim()) ? name.trim() : `untitled${idx++}`;
    return raw.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");
  };

  const cssVars: string[] = [];
  const scssVars: string[] = [];
  const tailwindRgbRefs: string[] = [];

  
  for (const c of colors) {
    const n = safeName(c.hexName);
    cssVars.push(`--${n}-color: ${c.hexCode};`);
    scssVars.push(`$${n}-color: ${c.hexCode};`);
    tailwindRgbRefs.push(`'rgb(var(--color-${n}) / <alpha-value>)'`);
  }

  return { cssVars, scssVars, tailwindRgbRefs };
}

export { buildCssExports }