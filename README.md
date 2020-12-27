# id3-rw
Insanely quick ID3 reading & writing for JavaScript powered by WebAssembly.

## Supported metadata types
- [ ] ID3v2 (mp3)
  - [x] read
  - [ ] write

## Usage

### Getting audio metadata
```javascript
import { get_audio_metadata } from "id3-rw"

const url = 'https://upload.wikimedia.org/wikipedia/commons/b/bd/%27Tis_a_faded_picture_by_Florrie_Forde.mp3'

fetch(url).then(async response => {
  const stream = response.body
  const metadata = await get_audio_metadata(stream)
  console.log(metadata)
  // { artist: "Florrie Forde", title: "'Tis a faded picture", album: "Edison Amberol: 12255" }

  // IMPORTANT! Always remember to destroy the metadata
  // after you've got the properties you need,
  // else you'll get a memory leak!
  metadata.free()
})

console.log(metadata)
```

### Modifying audio metadata
```javascript
import { TagController } from "id3-rw"

const stream = fetch('https://upload.wikimedia.org/wikipedia/commons/b/bd/%27Tis_a_faded_picture_by_Florrie_Forde.mp3')
const metadataController = TagController.from(stream)

// Getting metadata using the controller API
const metadata = metadataController.get_metadata()
console.log(metadata)
// { artist: "Florrie Forde", title: "'Tis a faded picture", album: "Edison Amberol: 12255" }
metadata.free()

// Changing the metadata
metadataController.setYear("1910")

// Getting the resulting Uint8Array, which can be used with the File System API 
const uint8Array = metadataController.get_uint8array()

// Getting the resulting Uint8Array in a Blob, which can be used as the content for a download
const blob = metadataController.get_blob()

// IMPORTANT! Don't forget to destroy the metadataController!
metadataController.free()
```

## Performance
I tested it on my collection of 1644 songs.
A single acquirement of metadata seems to take about 1 ms.
The mode is 0.44 ms, and it's pretty consistently between 2 and 0.3 ms.
There are occasional outliers like 10 ms or even 13 ms, but they shouldn't
be a big concern, they very rarely occur.
The big thing which this library has against others is that it
doesn't utilise the garbage collector thanks to WebAssembly,
so theoretically an infinite amount of files can be processed without a fuss.
My whole library gets processed in 6 seconds, which includes the file I/O too.