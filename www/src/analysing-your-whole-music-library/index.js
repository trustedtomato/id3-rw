// eslint-disable-next-line camelcase
import { getMetadataFrom } from 'id3-rw'

const selectButton = document.getElementById('select')
const trackList = document.getElementById('tracks')

async function * readdir (fileHandle) {
  yield fileHandle
  if (fileHandle.kind === 'directory') {
    for await (const childFileHandle of fileHandle.values()) {
      yield * readdir(childFileHandle)
    }
  }
}

selectButton.addEventListener('click', async () => {
  const dirHandle = await window.showDirectoryPicker()
  for await (const entry of readdir(dirHandle)) {
    if (entry.kind === 'file') {
      const file = await entry.getFile()
      const stream = await file.stream()
      const metadata = await getMetadataFrom(stream)
      const trackListItem = document.createElement('div')
      trackListItem.classList.add('track')

      if (metadata) {
        const img = document.createElement('img')

        const albumCover = metadata.albumCover
        if (albumCover) {
          img.src = URL.createObjectURL(
            new Blob([albumCover.data.buffer]),
            { type: albumCover.mimeType }
          )
          trackListItem.appendChild(img)
          albumCover.free()
        }

        const textMetadata = document.createElement('div')

        for (const x of [
          'title',
          'artist',
          'album',
          'albumArtist',
          'year'
        ]) {
          const text = document.createElement('div')
          text.appendChild(document.createTextNode(
            `${x}: ${metadata[x] || `UNKNOWN_${x.toUpperCase()}`}`
          ))
          textMetadata.appendChild(text)
        }

        trackListItem.appendChild(textMetadata)

        metadata.free()
      } else {
        trackListItem.appendChild(
          document.createTextNode(
            `${file.name} = UNKNOWN_METADATA`
          )
        )
      }
      trackList.appendChild(trackListItem)
    }
  }
})
