figma.showUI(__html__);
figma.ui.resize(500, 700);

async function getUserCollections() {
  const userSetVaribles = await figma.variables.getLocalVariablesAsync();
  console.log(userSetVaribles);
  const { valuesByMode } = userSetVaribles[1];
  console.log(valuesByMode);
}


   //PALETTE COMPONENT STYLES

const paletteComponent = {
  styles: {
    textNodeContainer: {
      direction: "VERTICAL",
      alignChildren: "CENTER",
      backgroundType: "SOLID",
      backgroundColor: [0, 0, 0],
      opacity: 0,
      xaxisSizing: "AUTO",
      zaxisSizing: "AUTO",
    },

    colorBlock: {
      width: 199,
      height: 230,
      cornerRadius: 8,
    },

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



 

figma.ui.onmessage = async (
  msg: { setHexValue: string; setNameText: string; colorPaletteObjects: any[] }
) => {

  const { styles } = paletteComponent;
  const containerStyles = styles.textNodeContainer;
/////////////////////////////////////////////////////////////
    // const masterFrame = figma.createFrame();
    // masterFrame.layoutMode = "HORIZONTAL";
    // masterFrame.layoutWrap = "WRAP";
    // masterFrame.resize(2133, 1671);
    // masterFrame.fills = [
    //   { type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } },
    // ];

    // masterFrame.paddingTop = 213;
    // masterFrame.paddingBottom = 205;
    // masterFrame.paddingLeft = 139;
    // masterFrame.paddingRight = 1139;
//////////////////////////////////////////////////////////||||||||
    //Colorblock wrapper
    const colorGroupContainer = figma.createFrame();
    colorGroupContainer.layoutMode = "HORIZONTAL";
    colorGroupContainer.primaryAxisSizingMode = "AUTO";
    colorGroupContainer.counterAxisSizingMode = "AUTO";
    colorGroupContainer.maxWidth = 1524;
    colorGroupContainer.layoutWrap = "WRAP"
    colorGroupContainer.counterAxisSpacing = styles.colorGroupContainer.spacingZ
    colorGroupContainer.itemSpacing = styles.colorGroupContainer.spacingY
    colorGroupContainer.paddingTop = styles.colorGroupContainer.paddingY;
    colorGroupContainer.paddingBottom = styles.colorGroupContainer.paddingY;
    colorGroupContainer.paddingLeft = styles.colorGroupContainer.paddingX;
    colorGroupContainer.paddingRight = styles.colorGroupContainer.paddingX;
    colorGroupContainer.primaryAxisAlignItems = "CENTER";

    colorGroupContainer.cornerRadius =
      styles.colorGroupContainer.cornerRadius;


    colorGroupContainer.fills = [
      { type: "SOLID", color: { r: 0.850, g: 0.850, b: 0.850 }, opacity: 1 },
    ];


///////////////////////////////////////////////////////////////


   //  looping through colorPaletteObject
 
  for (const item of msg.colorPaletteObjects) {
    setTimeout(()=>{
      console.log("1")
    },1000)
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    setTimeout(()=>{

          const hexText = figma.createText();
    hexText.characters = item.hexCode;
    hexText.fontSize = 24;
    hexText.fills = [
      { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0.5 },
    ];

    const nameText = figma.createText();
    nameText.characters = item.hexName || "";
    nameText.fontSize = 16;

    
    // Text node container styles
  
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

    textNodeContainer.appendChild(hexText);
    textNodeContainer.appendChild(nameText);

    
       // color block style
    
    const colorBlock = figma.createRectangle();
    colorBlock.resize(styles.colorBlock.width, styles.colorBlock.height);
    colorBlock.cornerRadius = styles.colorBlock.cornerRadius;
    colorBlock.fills = [
      { type: "SOLID", color: hexToFigmaRGB(item.hexCode) },
    ];

    
    //Wrapped Palete (big card)
    
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

    wrapPalette.fills = [
      {
        type: "SOLID",
        color: styles.wrapPalette.fillColor,
      },
    ];
    wrapPalette.strokes = [
      { type: "SOLID", color: styles.wrapPalette.strokeColor },
    ];
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
    colorGroupContainer.appendChild(wrapPalette);



    },2500)

  }

};



//color parser

function hexToFigmaRGB(hex: string) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  const num = parseInt(hex, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}
