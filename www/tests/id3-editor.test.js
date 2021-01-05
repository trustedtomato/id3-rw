const { waitForFile } = require('./utils')
const path = require('path')

const mp3 = path.join(__dirname, 'tis-a-faded-picture.mp3')
const downloadedMp3 = path.join(__dirname, 'downloads', path.basename(mp3))
const initialMetadata = {
  title: '\'Tis a faded picture',
  artist: 'Florrie Forde',
  year: ''
}
const metadataToChange = {
  title: 'Modified title',
  album: 'Modified album',
  album_artist: 'Modified album artist',
  genre: 'Modified genre',
  track_index: '1',
  track_count: '2',
  disc_index: '3',
  disc_count: '4',
  year: '2012'
}
const changedMetadata = Object.assign({}, initialMetadata, metadataToChange)

const getTextMetadata = async (page) => {
  return page.$$eval('input[data-name]', inputs => {
    const metadata = {}
    for (const input of inputs) {
      metadata[input.dataset.name] = input.value
    }
    return metadata
  })
}

const changeTextMetadata = async (page, newMetadata) => {
  for (const [key, value] of Object.entries(newMetadata)) {
    const input = await page.$(`input[data-name="${key}"]`)
    await input.click({ clickCount: 3 })
    await input.type(value)
  }
}

describe('ID3 Editor', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080/id3-editor/')
    const upload = await page.$('#upload')
    await upload.uploadFile(mp3)
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: path.join(__dirname, 'downloads')
    })
  })

  it('should output the correct text metadata', async () => {
    const metadata = await getTextMetadata(page)
    expect(metadata).toEqual(expect.objectContaining(initialMetadata))
  })

  it('should change the text inputs', async () => {
    await changeTextMetadata(page, metadataToChange)
    const metadata = await getTextMetadata(page)
    expect(metadata).toEqual(expect.objectContaining(changedMetadata))
  })

  it('should download the file', async () => {
    await page.click('#download')
    await waitForFile(downloadedMp3)
  })

  it('should reload the page', async () => {
    await page.reload()
  })

  it('should upload the downloaded file', async () => {
    const upload = await page.$('#upload')
    await upload.uploadFile(downloadedMp3)
  })

  it('should output the modified text metadata', async () => {
    const metadata = await getTextMetadata(page)
    expect(metadata).toEqual(expect.objectContaining(changedMetadata))
  })
})