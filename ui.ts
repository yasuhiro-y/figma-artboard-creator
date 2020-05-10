
function init() {
  // Get stored URL
  parent.postMessage({ pluginMessage: { type: 'get-url' } }, '*');
}
//  get data and run scripts when pressed create
document.getElementById('create').onclick = () => {
  const textbox: any = document.getElementById('sheetId');
  const sheetId: string = textbox.value
  getData(sheetId).then(data => {
    data = JSON.parse(JSON.stringify(data))
    data = data["feed"]["entry"]
    parent.postMessage({ pluginMessage: { type: 'create', content: data } }, '*')
  })
}
// Close when pressed cancel
document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}
// Get data from Spreadsheet ID
async function getData(id) {
  const url = 'https://spreadsheets.google.com/feeds/cells/' + id + '/1/public/full?alt=json'
  let data = await (await fetch(url)).json();
  return data
}
init()
