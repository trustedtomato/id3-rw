import * as id3 from './wasm/id3_rw'

function concatTypedArrays (typedArrays, Type = Uint8Array) {
  const result = new (Type)(typedArrays.reduce((acc, typedArray) => acc + typedArray.byteLength, 0))
  let offset = 0
  typedArrays.forEach((typedArray) => {
    result.set(typedArray, offset)
    offset += typedArray.byteLength
  })
  return result
}

async function createTagControllerFrom (stream) {
  if (!stream) {
    return id3.TagController.new()
  }

  if (stream.constructor.name === 'Uint8Array') {
    return id3.TagController.from(stream)
  }

  const reader = stream.getReader()

  // Keep streamed data.
  let streamed = new Uint8Array(0)

  try {
    while (true) {
      // Read a chunk of data.
      const { value, done } = await reader.read()

      // The stream has ended, return.
      if (done) {
        return null
      }

      // The stream hasn't ended yet so value contains a TypedArray.
      streamed = concatTypedArrays([streamed, value])

      try {
        // Try to read metadata using the data which has been already read.
        // This might result in an error since the data may be very much incomplete.
        const tagController = id3.TagController.from(streamed)
        return tagController
      } catch (err) {
        if (!err.message.includes('UnexpectedEndOfStream')) {
          // The Error which has occurred is not due to the lack of sent data,
          // so we should propagate it.
          throw err
        }
      }
    }
  } finally {
    // Release the data even if an error occurred in an unexpected place.
    reader.releaseLock()
    stream.cancel()
  }
}

async function getMetadataFrom (stream) {
  const tagController = await createTagControllerFrom(stream)
  const metadata = tagController.getMetadata()
  tagController.free()
  return metadata
}

export {
  getMetadataFrom,
  createTagControllerFrom
}
export * from './wasm/id3_rw'
