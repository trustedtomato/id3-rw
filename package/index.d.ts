import { Metadata, TagController } from './wasm/id3_rw'
export * from './wasm/id3_rw'

/**
 * Gets the ID3 metadata from the specified buffer or stream.
 * Basically calls `create_tag_controller`, gets the metadata and frees up the `TagController`.
 */
export declare function getMetadataFrom (streamOrBuffer: ReadableStream<Uint8Array> | Uint8Array): Promise<Metadata>

/**
 * Creates a tag controller from the tag of the specified buffer or stream.
 * The function will read the whole tag, but probably not the whole stream,
 * so performance-wise it's favorable to send the stream and not the whole file's buffer if possible.
 * Additionally, if there is no tag there or you call the function without arguments,
 * the function returns an empty tag.
 */
export declare function createTagControllerFrom (streamOrBuffer: ReadableStream<Uint8Array> | Uint8Array): Promise<TagController>
