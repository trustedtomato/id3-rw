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

async function create_tag_controller_from (stream) {
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
          throw err;
        }
      }
    }
  } finally {
    // Release the data even if an error occurred in an unexpected place.
    reader.releaseLock()
    stream.cancel()
  }
}

async function get_metadata_from (stream) {
  const tagController = await create_tag_controller_from(stream)
  const metadata = tagController.get_metadata()
  tagController.free()
  return metadata
}

export {
  get_metadata_from,
  create_tag_controller_from
}
export * from './wasm/id3_rw'