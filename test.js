"use strict";
// // This plugin will open a window to prompt the user to enter a number, and
// // it will then create that many rectangles on the screen.
// // This file holds the main code for plugins. Code in this file has access to
// // the *figma document* via the figma global object.
// // You can access browser APIs in the <script> tag inside "ui.html" which has a
// // full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
// // This shows the HTML page in "ui.html".
// figma.showUI(__html__);
// async function getUserCollections() {
//   const userSetVaribles = await figma.variables.getLocalVariablesAsync()
//   console.log(userSetVaribles)
//   const {valuesByMode} = userSetVaribles[1]
//   console.log(valuesByMode)
// }
// const container = {
//   parentContainer: {
//     direction: "VERTICAL",
//     size: [ 1240 , 1560 ],
//     padding: [{ x: 104 }, { y: 174 }],
//     justifyContent: ["center"],
//     childContainer: {
//     direction: "VERTICAL",
//     size: [ 237 , 358 ],
//     padding: [{ x: 19 }, { y: 24 }],
//     justifyContent: ["center"],
//     borderRadius: 14,
//   },
//     elementWrapper: {
//         direction: "VERTICAL",
//         size: [ 199 , 323 ],
//         gap: 24,
//         padding: [{ x: 0 }, { y: 0 }],
//         justifyContent: ["center"],
//     }
//   },
// } as const
// // Calls to "parent.postMessage" from within the HTML page will trigger this
// // callback. The callback will be passed the "pluginMessage" property of the
// // posted message.
// figma.ui.onmessage = async (msg: {setVariableName: string, setNameText: string}) => {
//   // One way of distinguishing between different types of messages sent from
//   // your HTML page is to use an object with a "type" property like this.
//     ////////////////////////////////////////
//     let hexText
//     let colorName
//     const getTextStyle = async () => {
//       await figma.loadFontAsync({family: "Inter", style: "Regular"})
//        hexText = await figma.createText();
//        hexText.characters = msg.setVariableName;
//        hexText.fontSize = 24;
//        colorName = await figma.createText()
//        colorName.characters = msg.setNameText;
//        colorName.fontSize = 16;
//        return [hexText, colorName]
//     }
//     ////////////////////////////////////////
//   //  figma.viewport.zoom = msg.setVariableName
//   // await getUserCollections()
//    [hexText, colorName] = await getTextStyle()
//   const {parentContainer} = container
//   const colorPalette = figma.createFrame()
//   const palette = figma.createRectangle()
//   const {direction, size, padding, justifyContent,} = parentContainer
//   palette.resize(199, 230)
//   palette.fills = [{type: "SOLID", color: hexToFigmaRGB(msg.setVariableName)}]
//   colorPalette.resize(size[0], size[1])
//   colorPalette.layoutMode = direction;
//   colorPalette.paddingTop = padding[1].y;
//   colorPalette.paddingBottom = padding[1].y;
//   colorPalette.paddingLeft = padding[0].x
//   colorPalette.paddingRight = padding[0].x
//   colorPalette.appendChild(palette)
//   // figma.currentPage.appendChild(colorPalette)
//   const textHex = getTextStyle()
//   ///////////////////////////////////////////////////////////////////////////
//   const mainContainerElmnt = figma.createFrame();
// palette.layoutSizingHorizontal = "FILL"
//   mainContainerElmnt.appendChild(palette)
//   // mainContainerElmnt.insertChild(1, colorDetails)
//   mainContainerElmnt.resize(parentContainer.childContainer.size[0],
//                             parentContainer.childContainer.size[1]
//                                                                   ),
//   mainContainerElmnt.paddingTop = parentContainer.childContainer.padding[1].y
//   mainContainerElmnt.paddingBottom = parentContainer.childContainer.padding[1].y
//   mainContainerElmnt.paddingLeft = parentContainer.childContainer.padding[0].x
//   mainContainerElmnt.paddingRight = parentContainer.childContainer.padding[0].x
//   mainContainerElmnt.itemSpacing = 24
//   mainContainerElmnt.counterAxisAlignItems = 'CENTER'
//   mainContainerElmnt.layoutMode = container.parentContainer.childContainer.direction
//   mainContainerElmnt.strokes = [{type: "SOLID", color: {r: 0.7, g: 0.7, b: 0.7}}]
//   mainContainerElmnt.strokeWeight = 0.8;
//   mainContainerElmnt.cornerRadius = 14;
//   const colorDetails = figma.createFrame();
//   colorDetails.layoutMode = "VERTICAL"
//   colorDetails.layoutSizingHorizontal = "FILL"
//   colorDetails.insertChild(1, hexText);
//   colorDetails.insertChild(2, colorName);
//   mainContainerElmnt.insertChild(1, colorDetails)
//   figma.closePlugin();
// };
// // Converts "#RRGGBB" or "#RGB" → { r: 0–1, g: 0–1, b: 0–1 }
// function hexToFigmaRGB(hex: string) {
//   hex = hex.replace('#', '');
//   // Support shorthand (#RGB)
//   if (hex.length === 3) {
//     hex = hex.split('').map(ch => ch + ch).join('');
//   }
//   const num = parseInt(hex, 16);
//   return {
//     r: ((num >> 16) & 255) / 255,
//     g: ((num >> 8) & 255) / 255,
//     b: (num & 255) / 255
//   };
// }
