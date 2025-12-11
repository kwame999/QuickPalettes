
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

async function getUserCollections() {
  
  const userSetVaribles = await figma.variables.getLocalVariablesAsync()
  console.log(userSetVaribles)
  const {valuesByMode} = userSetVaribles[1]
  console.log(valuesByMode)
}

const container = {

  parentContainer: {

    direction: "VERTICAL",
    size: [ 1240 , 1560 ],
    padding: [{ x: 104 }, { y: 174 }],
    justifyContent: ["center"],


    childContainer: {

    direction: "VERTICAL",
    size: [ 237 , 358 ],
    padding: [{ x: 19 }, { y: 24 }],
    justifyContent: ["center"],
    borderRadius: 14,
  },

    elementWrapper: {

        direction: "VERTICAL",
        size: [ 199 , 323 ],
        gap: 24,
        padding: [{ x: 0 }, { y: 0 }],
        justifyContent: ["center"],

    }
  },




} as const
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg: {setVariableName: string, setNameText: string}) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
    ////////////////////////////////////////
    let hexText
    let colorName
    const getTextStyle = async () => {

      await figma.loadFontAsync({family: "Inter", style: "Regular"})


       hexText = await figma.createText();
       hexText.characters = msg.setVariableName;
       hexText.fontSize = 24;
       hexText.fills = [{type: "SOLID", color: {r: 0, g: 0, b: 0}, opacity: 0.5}]

       colorName = await figma.createText()
       colorName.characters = msg.setNameText;
       colorName.fontSize = 16;
      
       return [hexText, colorName]
    }
   
//HEX TEXT Nodes
[hexText, colorName] = await getTextStyle()
const textNodeContainer = figma.createFrame();
textNodeContainer.layoutMode = "VERTICAL";
textNodeContainer.counterAxisAlignItems = 'CENTER';


textNodeContainer.primaryAxisSizingMode = "AUTO";       
textNodeContainer.counterAxisSizingMode = "AUTO";
textNodeContainer.fills = [{type: "SOLID", color: {r: 0, g: 0, b: 0}, opacity: 0}]
textNodeContainer.appendChild(hexText)
textNodeContainer.appendChild(colorName)
///////////////////////////////////////////
//Color Pallete
const colorNlock = figma.createRectangle();
colorNlock.resize(199, 230);
colorNlock.cornerRadius = 8;
colorNlock.fills = [{type: "SOLID", color: hexToFigmaRGB(msg.setVariableName)}]
///////////////////////////////////////////////
///Color BLOCK AND TEXT NODES JOINED TOGETHER

const wrapPalette = figma.createFrame();
wrapPalette.layoutMode = "VERTICAL";
wrapPalette.primaryAxisSizingMode = "AUTO";          // HUG vertically
wrapPalette.counterAxisSizingMode = "AUTO";          // HUG horizontally
wrapPalette.appendChild(colorNlock)
wrapPalette.appendChild(textNodeContainer)
wrapPalette.paddingTop = 24;
wrapPalette.paddingBottom = 24;
wrapPalette.paddingLeft = 19;
wrapPalette.paddingRight = 19;
wrapPalette.cornerRadius = 14;
wrapPalette.itemSpacing = 24;
wrapPalette.fills = [{type: "SOLID", color: ({r: 0.898, g: 0.898, b: 0.898})}]




  figma.closePlugin();
};



function hexToFigmaRGB(hex: string) {
  hex = hex.replace('#', '');

  // Support shorthand (#RGB)
  if (hex.length === 3) {
    hex = hex.split('').map(ch => ch + ch).join('');
  }

  const num = parseInt(hex, 16);

  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255
  };
}


