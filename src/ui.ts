import './ui.css'

document.getElementById('sheetId').onchange = () => {
  validateFormInput()
}
document.getElementById('wrapEvery').onchange = () => {
  validateFormInput()
}

//  get data and run scripts when pressed create
document.getElementById('create').onclick = () => {
  const values = formValues()
  getData(values.sheetId).then((data) => {
    data = JSON.parse(JSON.stringify(data))
    data = data['feed']['entry']
    parent.postMessage(
      {
        pluginMessage: {
          type: 'create',
          content: data,
          wrapEvery: values.wrapEvery,
          renderArtboardName: values.renderArtboardName,
        },
      },
      '*'
    )
  })
}

// Close when pressed cancel
document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}

// Get data from Spreadsheet ID
async function getData(id) {
  const url =
    'https://spreadsheets.google.com/feeds/cells/' +
    id +
    '/1/public/full?alt=json'
  let data = await (await fetch(url)).json()
  return data
}

const validateFormInput = () => {
  const values = formValues()
  let validate: string = ''
  if (values.sheetId === '' || values.sheetId == undefined) {
    validate = 'Spreadsheet ID is required.'
  }
  if (/spreadsheet/.test(values.sheetId)) {
    validate = 'Enter Spreadsheet ID instead of URL.'
  }
  if (values.wrapEvery === '' || values.wrapEvery == undefined) {
    validate = 'Wrap count is required.'
  }
  if (Number(values.wrapEvery) < 0) {
    validate = 'Wrap count must be integer.'
  }
  if (validate === '') {
    resetErrorMessage()
  } else {
    showErrorMessage(validate)
  }
}

const showErrorMessage = (errorText: string) => {
  if (document.getElementById('errorTextSpan') != null) {
    const errorTextSpan = document.getElementById('errorTextSpan')
    errorTextSpan.parentNode.removeChild(errorTextSpan)
  }
  const errorTextParent = document.getElementById('errorText')
  const errorTextSpan = document.createElement('span')
  const createButton = <HTMLInputElement>document.getElementById('create')
  errorTextSpan.innerHTML = errorText
  errorTextSpan.id = 'errorTextSpan'

  errorTextParent.appendChild(errorTextSpan)
  createButton.disabled = true
  console.log(createButton.disabled)
}

const resetErrorMessage = () => {
  const createButton = <HTMLInputElement>document.getElementById('create')

  createButton.disabled = false
  console.log(createButton.disabled)

  if (document.getElementById('errorTextSpan') != null) {
    const errorTextSpan = document.getElementById('errorTextSpan')
    errorTextSpan.parentNode.removeChild(errorTextSpan)
  }
}
const formValues = () => {
  const sheetIdInput: HTMLInputElement = <HTMLInputElement>(
    document.getElementById('sheetId')
  )
  const wrapEveryInput: HTMLInputElement = <HTMLInputElement>(
    document.getElementById('wrapEvery')
  )
  const renderArtboardNameInput: HTMLInputElement = <HTMLInputElement>(
    document.getElementById('renderArtboardName')
  )
  const values = {
    sheetId: sheetIdInput.value,
    wrapEvery: wrapEveryInput.value,
    renderArtboardName: renderArtboardNameInput.checked,
  }
  return values
}
