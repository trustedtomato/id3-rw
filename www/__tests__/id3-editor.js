const path = require('path');
const mp3 = path.join(__dirname, 'tis-a-faded-picture.mp3')

describe('ID3 Editor', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080/id3-editor/');
    const upload = await page.$('#upload')
    await upload.uploadFile(mp3)
  });

  it('should output the title in the title input', async () => {
    const title = await page.$eval('input[data-name="title"]', input => input.value)
    expect(title).toMatch('\'Tis a faded picture')
  })

  it('should output the artist in the artist input', async () => {
    const artist = await page.$eval('input[data-name="artist"]', input => input.value)
    expect(artist).toMatch('Florrie Forde')
  })

  it('should output nothing to where there was no metadata given', async () => {
    const year = await page.$eval('input[data-name="year"]', input => input.value)
    expect(year).toMatch('')
  })
});