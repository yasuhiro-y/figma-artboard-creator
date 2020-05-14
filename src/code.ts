figma.showUI(__html__, { width: 428, height: 365, visible: true })
figma.ui.onmessage = async (msg) => {
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' })
  if (msg.type === 'create') {
    const nodes: SceneNode[] = []

    let name: string, width: number, height: number
    let offsetX: number = 0
    let offsetY: number = 0
    let maxHeight: number = 0
    let margin: number = 200

    const wrapEvery: number = msg.wrapEvery
    const renderArtboardName: boolean = msg.renderArtboardName

    const cells: any = msg.content

    const artboards: Artboard[] = shapeCellsToArtboards(cells)

    for (let i: number = 0; i < artboards.length; i++) {
      name = artboards[i].name
      width = artboards[i].width
      height = artboards[i].height

      const artboard: FrameNode = createArtboard(
        name,
        width,
        height,
        offsetX,
        offsetY
      )

      if (renderArtboardName) {
        const artboardNameIndicator: GroupNode = createArtboardNameIndicator(
          name
        )
        artboard.appendChild(artboardNameIndicator)
        artboardNameIndicator.x = 30
        artboardNameIndicator.y = 20
        nodes.push(artboardNameIndicator)
      }
      maxHeight = maxHeight <= height ? height : maxHeight
      offsetX = offsetX + width + margin

      if ((i + 1) % wrapEvery === 0 && i != 0) {
        offsetX = 0
        offsetY = offsetY + maxHeight + margin
        maxHeight = 0
      }
      nodes.push(artboard)
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
    row = Number(cells[i]['gs$cell']['row'])
    col = Number(cells[i]['gs$cell']['col'])
    value = String(cells[i]['gs$cell']['$t'])

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
      name = null
      width = null
      height = null
      rowIndex++
    }

    if ((i + 1) % 3 === 0 && i != 0 && name && width && height) {
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
