const fs = require('fs')
const path = require('path')
const readme = fs.readFileSync(path.join(__dirname, '../../README.md'), 'utf-8')

// Get the snippets from the README.md file
const snippets = [...readme.matchAll(/```javascript([\s\S]*?)```/g)]
  .map(match => match[1]
    // Replace imports from 'id3-rw' with object destruction
    // (in the for-testing page, window.id3 holds the imported id3 object)
    .replace(/import\s+{(.+?)}\s+from 'id3-rw'/g, (_, toDestruct) => `const {${toDestruct}} = window.id3`)
  )

describe('README snippets', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080/for-testing/', { waitUntil: 'load' })
    await page.waitForSelector('#ready', { visible: true })
    
    await page.evaluate(() => {
      window.expectToEqual = (val1, val2) => {
        if (val1 === val2) return;
        throw new Error(`${JSON.stringify(val1)} !== ${JSON.stringify(val2)}`)
      }
      window.expectToContain = (obj, toBeContained) => {
        for (const [key, value] of Object.entries(toBeContained)) {
          window.expectToEqual(obj[key], value)
        }
      }
    })
  })

  snippets.forEach(async (snippet, i) => {
    test(`#${i + 1} should be working`, async () => {
      // Do this eval trickery in order to support top-level await in README.
      await page.evaluate(eval(`async () => {${snippet}}`))
    })
  })
})