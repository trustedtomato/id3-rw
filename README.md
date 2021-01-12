# id3-rw
Insanely quick ID3 reading & writing for JavaScript powered by WebAssembly.

![Test](https://github.com/trustedtomato/id3-rw/workflows/Test/badge.svg?branch=master)
![GitHub Pages](https://github.com/trustedtomato/id3-rw/workflows/GitHub%20Pages/badge.svg?event=push)

![Screenshot of id3-rw in action.](https://raw.githubusercontent.com/trustedtomato/id3-rw/master/demo-cropped.gif)

## Demos
Demos can be found on [id3-rw's website](https://trustedtomato.github.io/id3-rw/).

## Usage

### Getting metadata
```javascript
import { getMetadataFrom } from 'id3-rw'

const url = 'https://upload.wikimedia.org/wikipedia/commons/b/bd/%27Tis_a_faded_picture_by_Florrie_Forde.mp3'

await fetch(url).then(async response => {
  const stream = response.body
  const metadata = await getMetadataFrom(stream)
  expectToContain(metadata, {
    artist: "Florrie Forde\r",
    title: "'Tis a faded picture\r",
    album: "Edison Amberol: 12255\r"
  })

  // IMPORTANT! Always remember to destroy the metadata
  // after you've got the properties you need,
  // else you'll get a memory leak!
  metadata.free()
})
```

### Modifying audio metadata
```javascript
import { createTagControllerFrom } from 'id3-rw'

await fetch('https://upload.wikimedia.org/wikipedia/commons/b/bd/%27Tis_a_faded_picture_by_Florrie_Forde.mp3').then(async response => {
  const buffer = new Uint8Array(await response.arrayBuffer())

  const tagController = await createTagControllerFrom(buffer)

  // Getting metadata using the controller API
  const metadata = tagController.getMetadata()
  expectToContain(metadata, {
    artist: 'Florrie Forde\r',
    title: '\'Tis a faded picture\r',
    album: 'Edison Amberol: 12255\r'
  })
  metadata.free()

  // Changing the metadata
  tagController.setYear(1910)

  // Getting the resulting Uint8Array (the tagged file's buffer),
  // which can be used with the File System API or for a download
  const taggedBuffer = tagController.putTagInto(buffer)
  expectToEqual(taggedBuffer.length > 0, true)

  // IMPORTANT! Don't forget to destroy the tagController!
  tagController.free()
})
```

## API
See [generated docs](https://trustedtomato.github.io/id3-rw/docs/).

## Contributing
Clone this repository. You should build the Rust project by running `build.sh`.
To run the examples locally, you need to `cd` into `www`, run `npm install` then `npm start`.
Now you should be able to access the examples at `localhost:8080`.

If you have any questions, feel free to open an issue!

## Acknowledgement
This library uses a patched version of the [rust-id3](https://github.com/polyfloyd/rust-id3) library,
so most of the hard work was done by its developer [polyfloyd](https://github.com/polyfloyd). Thank you!