# id3-rw
Insanely quick ID3 reading & writing for JavaScript powered by WebAssembly.

![Screenshot of id3-rw in action.](./demo-cropped.gif)

## Usage

### Getting metadata
```javascript
import { get_metadata_from } from 'id3-rw'

const url = 'https://upload.wikimedia.org/wikipedia/commons/b/bd/%27Tis_a_faded_picture_by_Florrie_Forde.mp3'

fetch(url).then(async response => {
  const stream = response.body
  const metadata = await get_metadata_from(stream)
  console.log(metadata)
  // → { artist: "Florrie Forde", title: "'Tis a faded picture", album: "Edison Amberol: 12255" }

  // IMPORTANT! Always remember to destroy the metadata
  // after you've got the properties you need,
  // else you'll get a memory leak!
  metadata.free()
})
```

### Modifying audio metadata
```javascript
import { create_tag_controller_from } from 'id3-rw'

fetch('https://upload.wikimedia.org/wikipedia/commons/b/bd/%27Tis_a_faded_picture_by_Florrie_Forde.mp3').then(async response => {
  const stream = response.body

  // Note that create_tag_controller_from only reads the stream until the tag is read (not the entire file),
  // which makes it fast, but when we want to obtain the modified MP3,
  // we have to use the put_tag_into method with the full file's buffer (see below)
  const tagController = await create_tag_controller_from(stream)

  // Getting metadata using the controller API
  const metadata = tagController.get_metadata()
  console.log(metadata)
  // → { artist: "Florrie Forde", title: "'Tis a faded picture", album: "Edison Amberol: 12255" }
  metadata.free()

  // Changing the metadata
  tagController.set_year(1910)

  // Getting the resulting Uint8Array (the tagged file's buffer),
  // which can be used with the File System API or for a download
  const buffer = new Uint8Array(await response.arrayBuffer())
  const taggedBuffer = tagController.put_tag_into(buffer)

  // IMPORTANT! Don't forget to destroy the tagController!
  tagController.free()
})
```

## API
See [generated docs](https://trustedtomato.github.io/id3-rw/).

## Contributing
Clone this repository. You should build the Rust project by running `build.sh`.
To run the examples locally, you need to `cd` into `www`, run `npm install` then `npm start`.
Now you should be able to access the examples at `localhost:8080`.

If you have any questions, feel free to open an issue!

## Acknowledgement
This library uses a patched version of the [rust-id3](https://github.com/polyfloyd/rust-id3) library,
so most of the hard work was done by its developer [polyfloyd](https://github.com/polyfloyd). Thank you!