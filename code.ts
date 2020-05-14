figma.showUI(__html__)
figma.ui.onmessage = async (msg) => {
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' })
  if (msg.type === 'create') {
    const nodes: SceneNode[] = []

    let name: string, width: number, height: number
    let offsetX: number = 0,
      offsetY: number = 0
    let maxHeight: number = 0
    let margin: number = 200

    const cells: any = msg.content

    const artboards: Artboard[] = shapeCellsToArtboards(cells)

    for (let i: number = 0; i < artboards.length; i++) {
      console.log('<>')

      name = artboards[i].name
      width = artboards[i].width
      height = artboards[i].height

      const artboard = createArtboard(name, width, height, offsetX, offsetY)
      const artboardNameIndicator: GroupNode = createArtboardNameIndicator(name)
      artboard.appendChild(artboardNameIndicator)
      artboardNameIndicator.x = 30
      artboardNameIndicator.y = 20
      nodes.push(artboard)
      nodes.push(artboardNameIndicator)
      offsetX = offsetX + width
      maxHeight = maxHeight <= height && height

      if ((i + 1) % 5 === 0 && i != 0) {
        offsetY = offsetY + maxHeight + margin
        offsetX = 0
        maxHeight = 0
      }

      console.log('</>')
    }

    figma.currentPage.selection = nodes
    figma.viewport.scrollAndZoomIntoView(nodes)
  }
  figma.closePlugin()
}

interface Artboard {
  name?: string
  width?: number
  height?: number
}

const shapeCellsToArtboards = (cells: any) => {
  console.log(cells)
  const artboards: Artboard[] = []
  let value: string, row: number, col: number
  let rowIndex: number = 1
  let name = ''
  let width = 0
  let height = 0

  for (let i = 0; i < cells.length; i++) {
    value = String(cells[i]['gs$cell']['inputValue'])
    row = Number(cells[i]['gs$cell']['row'])
    col = Number(cells[i]['gs$cell']['col'])

    if (row === rowIndex && col === 1) {
      name = String(value)
      console.log(name)
    } else if (row === rowIndex && col === 2) {
      width = Number(value)
      console.log(width)
    } else if (row === rowIndex && col === 3) {
      height = Number(value)
      console.log(height)
    } else {
      // 入力エラー
    }

    if ((i + 1) % 3 === 0 && i != 0) {
      artboards.push({ name, width, height })
      name = null
      width = null
      height = null
      rowIndex++
    }
  }

  return artboards
}

const createArtboard = (
  name: string,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number
) => {
  const frame: FrameNode = figma.createFrame()
  frame.x = offsetX
  frame.y = offsetY
  frame.resize(width, height)
  frame.name = name
  figma.currentPage.appendChild(frame)
  return frame
}

const createArtboardNameIndicator = (name: string) => {
  const text = createTextFrame(name)
  const border = createBorder(text.width)
  const group: GroupNode = figma.group([text, border], figma.currentPage)
  group.name = 'Artboard Name'
  return group
}

const createTextFrame = (name: string) => {
  const frame: TextNode = figma.createText()
  frame.name = 'Name indicator'
  frame.characters = name
  frame.fontSize = 24
  frame.name = 'Name'
  frame.fontName = {
    family: 'Roboto',
    style: 'Regular',
  }
  return frame
}

const createBorder = (width: number) => {
  const border: LineNode = figma.createLine()
  border.name = 'border'
  border.resize(width, 0)
  border.y = 36
  return border
}
