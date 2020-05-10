figma.showUI(__html__);
figma.ui.onmessage = async (msg) => {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" })
  if (msg.type === 'create') {

    const nodes: SceneNode[] = [];

    let rowIndex: number = 1
    let name: string, width: number, height: number
    let value: string, row: number, col: number
    let offsetX: number = 0, offsetY: number = 0
    let maxHeight: number = 0
    let margin: number = 200

    const cells: any = msg.content

    for (let i: number = 0; i < cells.length; i++) {
      console.log("<>")
      value = cells[i]["gs$cell"]["inputValue"]
      row = Number(cells[i]["gs$cell"]["row"])
      col = Number(cells[i]["gs$cell"]["col"])
      console.log(rowIndex, col)

      if (row === rowIndex && col === 1) {
        name = String(value)
      } else if (row === rowIndex && col === 2) {
        width = Number(value)
        offsetX = offsetX + margin
      }
      else if (row === rowIndex && col === 3) {
        height = Number(value)
      } else {
        // 入力エラー
      }

      console.log(name, width, height)
      if ((i + 1) % 3 === 0 && i != 0) {
        const artboard = createArtboard(name, width, height, offsetX, offsetY)
        const artboardNameIndicator: GroupNode = createArtboardNameIndicator(name)
        artboard.appendChild(artboardNameIndicator)
        artboardNameIndicator.x = 30
        artboardNameIndicator.y = 20
        nodes.push(artboard);
        nodes.push(artboardNameIndicator);
        offsetX = offsetX + width
        maxHeight = maxHeight <= height && height
      }

      if ((i + 1) % 15 === 0 && i != 0) {
        offsetY = offsetY + maxHeight + margin
        offsetX = 0
        maxHeight = 0
      }

      if ((i + 1) % 3 === 0) {
        rowIndex++
      }
      console.log("</>")
    }

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
  figma.closePlugin();
}

const createArtboard = (name: string, width: number, height: number, offsetX: number, offsetY: number) => {
  const frame: FrameNode = figma.createFrame();
  frame.x = offsetX
  frame.y = offsetY
  frame.resize(width, height)
  frame.name = name
  figma.currentPage.appendChild(frame);
  return frame
}

const createArtboardNameIndicator = (name: string) => {
  const text = createTextFrame(name)
  const border = createBorder(text.width)
  const group: GroupNode = figma.group([text, border], figma.currentPage)
  group.name = "Artboard Name"
  return group
}


const createTextFrame = (name: string) => {
  const frame: TextNode = figma.createText()
  frame.name = "Name indicator"
  frame.characters = name
  frame.fontSize = 24
  frame.name = "Name"
  frame.fontName = {
    family: "Roboto",
    style: "Regular"
  }
  return frame
}

const createBorder = (width: number) => {
  const border: LineNode = figma.createLine()
  border.name = "border"
  border.resize(width, 0)
  border.y = 36
  return border
}
