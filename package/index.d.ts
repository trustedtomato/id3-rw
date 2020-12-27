import { Metadata, TagController } from './wasm/id3_rw'
export * from './wasm/id3_rw'

export declare function get_metadata_from (streamOrBuffer: ReadableStream<Uint8Array> | Uint8Array): Promise<Metadata>
export declare function create_tag_controller_from (streamOrBuffer: ReadableStream<Uint8Array> | Uint8Array): Promise<TagController>

/*
declare module './wasm/id3_rw' {
  interface TagController {
      get_blob(): Blob;
  }
}
*/
