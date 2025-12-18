figma.showUI(__html__);
figma.ui.resize(284, 674);

// ---------- Types ----------
type PaletteItem = {
  hexCode: string;
  hexName?: string | null;
  id?: number;
};

type UIMessage =
  | {
      type: "create-from-ui";
      colorPaletteObjects: PaletteItem[];
      optionHex: boolean;
      optionName: boolean;
      optionNone: boolean;
    }
  | {
      type: "create-from-local-styles";
      optionHex: boolean;
      optionName: boolean;
      optionNone: boolean;
    };

// ---------- Styles ----------
const paletteComponent = {
  styles: {
    textNodeContainer: {
      direction: "VERTICAL",
      alignChildren: "CENTER",
      backgroundType: "SOLID",
      backgroundColor: [0, 0, 0] as const,
      opacity: 0,
      xaxisSizing: "AUTO",
      zaxisSizing: "AUTO",
    },
    colorBlock: { width: 199, height: 230, cornerRadius: 8 },
    wrapPalette: {
      padding: { top: 24, bottom: 24, left: 19, right: 19 },
      cornerRadius: 14,
      spacing: 24,
      fillColor: { r: 0.898, g: 0.898, b: 0.898 },
      strokeColor: { r: 0.7, g: 0.7, b: 0.7 },
    },
    colorGroupContainer: {
      paddingY: 37,
      paddingX: 4,
      cornerRadius: 16,
      spacingY: 73,
      spacingZ: 34,
    },
  },
} as const;

// ---------- Main handler ----------
figma.ui.onmessage = async (msg: UIMessage) => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const colors =
    msg.type === "create-from-local-styles"
      ? await getLocalStyleColors()
      : msg.colorPaletteObjects;

  // exports
  const exports = buildCssExports(colors);
  console.log(exports);

  // build frames
  const container = createColorGroupContainer();

  for (const item of colors) {
    const card = createPaletteCard(item, {
      optionHex: msg.optionHex,
      optionName: msg.optionName,
      optionNone: msg.optionNone,
    });
    container.appendChild(card);
  }

  figma.currentPage.appendChild(container);
  figma.viewport.scrollAndZoomIntoView([container]);
};

// ---------- UI building ----------
function createColorGroupContainer() {
  const { styles } = paletteComponent;

  const colorGroupContainer = figma.createFrame();
  colorGroupContainer.layoutMode = "HORIZONTAL";
  colorGroupContainer.primaryAxisSizingMode = "AUTO";
  colorGroupContainer.counterAxisSizingMode = "AUTO";
  colorGroupContainer.layoutWrap = "WRAP";
  colorGroupContainer.maxWidth = 1524;

  colorGroupContainer.counterAxisSpacing = styles.colorGroupContainer.spacingZ;
  colorGroupContainer.itemSpacing = styles.colorGroupContainer.spacingY;
  colorGroupContainer.paddingTop = styles.colorGroupContainer.paddingY;
  colorGroupContainer.paddingBottom = styles.colorGroupContainer.paddingY;
  colorGroupContainer.paddingLeft = styles.colorGroupContainer.paddingX;
  colorGroupContainer.paddingRight = styles.colorGroupContainer.paddingX;

  colorGroupContainer.primaryAxisAlignItems = "CENTER";
  colorGroupContainer.cornerRadius = styles.colorGroupContainer.cornerRadius;

  colorGroupContainer.fills = [
    { type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 }, opacity: 1 },
  ];

  return colorGroupContainer;
}

function createPaletteCard(
  item: PaletteItem,
  opts: { optionHex: boolean; optionName: boolean; optionNone: boolean }
) {
  const { styles } = paletteComponent;
  const containerStyles = styles.textNodeContainer;

  // text
  const hexText = figma.createText();
  hexText.characters = item.hexCode;
  hexText.fontSize = 24;
  hexText.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0.5 }];

  const nameText = figma.createText();
  nameText.characters = item.hexName || "";
  nameText.fontSize = 16;

  const textNodeContainer = figma.createFrame();
  textNodeContainer.layoutMode = containerStyles.direction;
  textNodeContainer.counterAxisAlignItems = containerStyles.alignChildren;
  textNodeContainer.primaryAxisSizingMode = containerStyles.xaxisSizing;
  textNodeContainer.counterAxisSizingMode = containerStyles.zaxisSizing;

  textNodeContainer.fills = [
    {
      type: containerStyles.backgroundType,
      color: {
        r: containerStyles.backgroundColor[0],
        g: containerStyles.backgroundColor[1],
        b: containerStyles.backgroundColor[2],
      },
      opacity: containerStyles.opacity,
    },
  ];

  if (opts.optionHex) textNodeContainer.appendChild(hexText);
  if (opts.optionName) textNodeContainer.appendChild(nameText);
  if (!opts.optionHex && !opts.optionName) textNodeContainer.visible = false;

  // color block
  const colorBlock = figma.createRectangle();
  colorBlock.resize(styles.colorBlock.width, styles.colorBlock.height);
  colorBlock.cornerRadius = styles.colorBlock.cornerRadius;
  colorBlock.fills = [{ type: "SOLID", color: hexToFigmaRGB(item.hexCode) }];

  // wrap
  const wrapPalette = figma.createFrame();
  wrapPalette.layoutMode = "VERTICAL";
  wrapPalette.primaryAxisSizingMode = "AUTO";
  wrapPalette.counterAxisSizingMode = "AUTO";

  wrapPalette.paddingTop = styles.wrapPalette.padding.top;
  wrapPalette.paddingBottom = styles.wrapPalette.padding.bottom;
  wrapPalette.paddingLeft = styles.wrapPalette.padding.left;
  wrapPalette.paddingRight = styles.wrapPalette.padding.right;
  wrapPalette.itemSpacing = styles.wrapPalette.spacing;

  wrapPalette.cornerRadius = styles.wrapPalette.cornerRadius;
  wrapPalette.fills = [{ type: "SOLID", color: styles.wrapPalette.fillColor }];
  wrapPalette.strokes = [{ type: "SOLID", color: styles.wrapPalette.strokeColor }];
  wrapPalette.strokeWeight = 0.8;

  wrapPalette.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0.804, g: 0.788, b: 0.788, a: 0.25 },
      offset: { x: 0, y: 4 },
      radius: 4,
      visible: true,
      spread: 0,
      blendMode: "NORMAL",
    },
  ];

  wrapPalette.primaryAxisAlignItems = "CENTER";
  wrapPalette.appendChild(colorBlock);
  wrapPalette.appendChild(textNodeContainer);

  return wrapPalette;
}

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

// ---------- Local styles ----------
async function getLocalStyleColors(): Promise<PaletteItem[]> {
  const styles = await figma.getLocalPaintStylesAsync();
  const out: PaletteItem[] = [];

  for (const s of styles) {
    const paint = s.paints?.[0];
    if (!paint || paint.type !== "SOLID") continue;

    const { r, g, b } = paint.color;
    out.push({
      hexCode: figmaRGBToHex(r, g, b),
      hexName: s.name,
    });
  }

  return out;
}

// ---------- Color utils ----------
function hexToFigmaRGB(hex: string) {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((ch) => ch + ch).join("");
  const num = parseInt(hex, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

function figmaRGBToHex(r: number, g: number, b: number) {
  const toHex = (value: number) =>
    Math.round(value * 255).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
