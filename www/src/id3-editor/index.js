import { create_tag_controller_from } from 'id3-rw'

const metadataInputs = document.querySelectorAll('*[data-name]')
const metadataEditor = document.getElementById('metadata-editor')
const uploadInput = document.getElementById('upload')

// Variables for global state management
let currentBufferPromise
let currentTagControllerPromise
let currentFileName

const initMetadataEditor = (tagController) => {
  // Show the metadata editor
  metadataEditor.style.display = 'block'

  // Initalise metadata inputs
  const metadata = tagController.get_metadata()
  for (const metadataInput of metadataInputs) {
    const value = String(metadata[metadataInput.dataset.name] || '').trim()
    metadataInput.dataset.originalValue = value
    metadataInput.value = value

    // Trigger removing the "changed" labels
    if (metadataInput.oninput) {
      metadataInput.oninput()
    }
  }
  metadata.free()
}

// Show "changed" labels if the input's data changed
// compared to it's original state
// (which was set when the current file was loaded).
for (const metadataInput of metadataInputs) {
  const isChangedElement = document.createElement('span')
  isChangedElement.appendChild(document.createTextNode(' (changed)'))
  isChangedElement.style.display = 'none'
  metadataInput.parentNode.appendChild(isChangedElement)

  metadataInput.oninput = () => {
    const isChanged =
      typeof metadataInput.dataset.originalValue !== 'undefined' &&
      metadataInput.dataset.originalValue !== metadataInput.value.trim()
    
    metadataInput.dataset.isChanged = isChanged
    isChangedElement.style.display = isChanged ? 'inline' : 'none'
  }
}

const downloadBlob = (blob, fileName) => {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = fileName
  a.click()
}

metadataEditor.addEventListener('submit', async e => {
  e.preventDefault()
  
  const [buffer, tagController] = await Promise.all([
    currentBufferPromise,
    currentTagControllerPromise
  ])
  
  for (const metadataInput of metadataInputs) {
    if (metadataInput.dataset.isChanged !== 'true') {
      continue
    }
    const value = metadataInput.value.trim()
    if (value === '') {
      tagController['remove_' + metadataInput.dataset.name](value)
    } else {
      tagController['set_' + metadataInput.dataset.name](value)
    }
  }

  downloadBlob(
    new Blob([
      tagController.put_tag_into(buffer)
    ]),
    currentFileName
  )
})

uploadInput.addEventListener('input', async () => {
  const file = uploadInput.files[0]
  if (!file) return

  // Free up the current tag controller
  if (currentTagControllerPromise) {
    currentTagControllerPromise.then(tagController => {
      tagController.free()
    })
  }

  const tagControllerPromise = create_tag_controller_from(file.stream())
  currentTagControllerPromise = tagControllerPromise
  currentFileName = file.name
  currentBufferPromise = file.arrayBuffer().then(buffer => new Uint8Array(buffer))
  
  tagControllerPromise.then(tagController => {
    // If the tagControllerPromise is not the current one,
    // then tagController is obsolete so it should not be loaded
    // into the editor.  
    if (tagControllerPromise !== currentTagControllerPromise) return;
    initMetadataEditor(tagController)
  })
})