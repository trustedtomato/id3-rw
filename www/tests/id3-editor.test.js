const { waitForFile } = require('./utils')
const path = require('path')

const mp3 = path.join(__dirname, 'tis-a-faded-picture.mp3')
const downloadedMp3 = path.join(__dirname, 'downloads', path.basename(mp3))
const mp3WithoutMetadata = path.join(__dirname, 'tis-a-faded-picture-without-metadata.mp3')
const downloadedMp3WithoutMetadata = path.join(__dirname, 'downloads', 'tis-a-faded-picture-without-metadata.mp3')

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

jest.setTimeout(30000)

describe('Modifying a tag', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080/id3-editor/', { waitUntil: 'load' })
    await page.waitForSelector('#upload:not([disabled])')
    const upload = await page.$('#upload:not([disabled])')
    await upload.uploadFile(mp3)
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: path.join(__dirname, 'downloads')
    })
    await page.waitForSelector('#metadata-editor', { visible: true })
  })

  it('should output the correct text metadata', async () => {
    expect.assertions(1)
    const metadata = await getTextMetadata(page)
    expect(metadata).toEqual(expect.objectContaining(initialMetadata))
  })

  it('should change the text inputs', async () => {
    expect.assertions(1)
    await changeTextMetadata(page, metadataToChange)
    const metadata = await getTextMetadata(page)
    expect(metadata).toEqual(expect.objectContaining(changedMetadata))
  })

  it('should download the file', async () => {
    expect.assertions(1)
    await page.click('#download')
    await waitForFile(downloadedMp3)
    expect(true).toBe(true)
  })

  it('should reload the page', async () => {
    expect.assertions(1)
    await page.reload()
    expect(true).toBe(true)
  })

  it('should upload the downloaded file', async () => {
    expect.assertions(1)
    const upload = await page.$('#upload')
    await upload.uploadFile(downloadedMp3)
    expect(true).toBe(true)
  })

  it('should output the modified text metadata', async () => {
    expect.assertions(1)
    const metadata = await getTextMetadata(page)
    expect(metadata).toEqual(expect.objectContaining(changedMetadata))
  })
})

describe('Creating a tag', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080/id3-editor/', { waitUntil: 'load' })
    const upload = await page.$('#upload')
    await upload.uploadFile(mp3WithoutMetadata)
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: path.join(__dirname, 'downloads')
    })
    await page.waitForSelector('#metadata-editor', { visible: true })
  })

  it('should change the text inputs', async () => {
    expect.assertions(1)
    await changeTextMetadata(page, metadataToChange)
    const metadata = await getTextMetadata(page)
    expect(metadata).toEqual(expect.objectContaining(metadataToChange))
  })

  it('should download the file', async () => {
    expect.assertions(1)
    await page.click('#download')
    await waitForFile(downloadedMp3WithoutMetadata)
    expect(true).toBe(true)
  })

  it('should reload the page', async () => {
    expect.assertions(1)
    await page.reload()
    expect(true).toBe(true)
  })

  it('should upload the downloaded file', async () => {
    expect.assertions(1)
    await page.waitForSelector('#upload:not([disabled])')
    const upload = await page.$('#upload:not([disabled])')
    await upload.uploadFile(downloadedMp3WithoutMetadata)
    expect(true).toBe(true)
  })

  it('should output the created text metadata', async () => {
    expect.assertions(1)
    const metadata = await getTextMetadata(page)
    expect(metadata).toEqual(expect.objectContaining(metadataToChange))
  })
})
