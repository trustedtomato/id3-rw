mod utils;

use wasm_bindgen::prelude::*;
use std::str::FromStr;
use id3;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct TagController {
    tag: id3::Tag
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct ExtendedTextMetadatum {
    description: String,
    value: String
}

#[wasm_bindgen]
impl ExtendedTextMetadatum {
    #[wasm_bindgen(getter)]
    pub fn description(&self) -> String {
        self.description.to_owned()
    }
    #[wasm_bindgen(getter)]
    pub fn value(&self) -> String {
        self.value.to_owned()
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct CommentMetadatum {
    description: String,
    lang: String,
    text: String
}

#[wasm_bindgen]
impl CommentMetadatum {
    #[wasm_bindgen(getter)]
    pub fn description(&self) -> String {
        self.description.to_owned()
    }
    #[wasm_bindgen(getter)]
    pub fn lang(&self) -> String {
        self.lang.to_owned()
    }
    #[wasm_bindgen(getter)]
    pub fn text(&self) -> String {
        self.text.to_owned()
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct AlbumCoverMetadatum {
    mime_type: String,
    data: Vec<u8>
}

#[wasm_bindgen]
impl AlbumCoverMetadatum {
    #[wasm_bindgen(getter)]
    pub fn mime_type(&self) -> String {
        self.mime_type.to_owned()
    }
    #[wasm_bindgen(getter)]
    pub fn data(&self) -> js_sys::Uint8Array {
        js_sys::Uint8Array::from(
            &self.data[..]
        )
    }
}

#[wasm_bindgen]
pub struct Metadata {
    artist: Option<String>,
    title: Option<String>,
    album: Option<String>,
    album_artist: Option<String>,
    genre: Option<String>,
    pub track_index: Option<u32>,
    pub track_count: Option<u32>,
    pub disc_index: Option<u32>,
    pub disc_count: Option<u32>,
    pub year: Option<i32>,
    date_recorded: Option<id3::Timestamp>,
    date_released: Option<id3::Timestamp>,
    pub duration: Option<u32>,
    publisher: Option<String>,
    comments: Vec<CommentMetadatum>,
    lyrics: Vec<CommentMetadatum>,
    album_cover: Option<AlbumCoverMetadatum>,
}

#[wasm_bindgen]
impl Metadata {
    #[wasm_bindgen(getter)]
    pub fn artist(&self) -> Option<String> {
        self.artist.to_owned()
    }
    #[wasm_bindgen(getter)]
    pub fn title(&self) -> Option<String> {
        self.title.to_owned()
    }
    #[wasm_bindgen(getter)]
    pub fn album(&self) -> Option<String> {
        self.album.to_owned()
    }
    #[wasm_bindgen(getter)]
    pub fn album_artist(&self) -> Option<String> {
        self.album_artist.to_owned()
    }
    #[wasm_bindgen(getter)]
    pub fn genre(&self) -> Option<String> {
        self.genre.to_owned()
    }
    #[wasm_bindgen(getter)]
    pub fn date_recorded(&self) -> Option<String> {
        self.date_recorded.map(|x| {
            x.to_string()
        })
    }
    #[wasm_bindgen(getter)]
    pub fn date_released(&self) -> Option<String> {
        self.date_released.map(|x| {
            x.to_string()
        })
    }
    #[wasm_bindgen(getter)]
    pub fn publisher(&self) -> Option<String> {
        self.publisher.to_owned()
    }
    #[wasm_bindgen(getter)]
    pub fn comments(&self) -> js_sys::Array {
        self.comments
            .iter()
            .map(|x| JsValue::from(x.to_owned()))
            .collect()
    }
    pub fn lyrics(&self) -> js_sys::Array {
        self.lyrics
            .iter()
            .map(|x| JsValue::from(x.to_owned()))
            .collect()
    }
    #[wasm_bindgen(getter)]
    pub fn album_cover(&self) -> Option<AlbumCoverMetadatum> {
        self.album_cover.to_owned()
    }
}

fn to_error<T: ToString>(error: T) -> JsValue {
    JsValue::from(
        js_sys::Error::new(
            &error.to_string()
        )
    )
}

#[wasm_bindgen]
impl TagController {
    pub fn new() -> TagController {
        TagController {
            tag: id3::Tag::new()
        }
    }
    pub fn from(buffer: &[u8]) -> Result<TagController, JsValue> {
        id3::Tag::read_from(std::io::Cursor::new(buffer))
            .map(|tag| {
                TagController {
                    tag
                }
            })
            .map_err(to_error)
    }
    pub fn set_artist(&mut self, artist: &str) { self.tag.set_artist(artist) }
    pub fn remove_artist(&mut self) { self.tag.remove_artist() }
    pub fn set_title(&mut self, title: &str) { self.tag.set_title(title) }
    pub fn remove_title(&mut self) { self.tag.remove_title() }
    pub fn set_album(&mut self, album: &str) { self.tag.set_album(album) }
    pub fn remove_album(&mut self) { self.tag.remove_album() }
    pub fn set_album_artist(&mut self, album_artist: &str) { self.tag.set_album_artist(album_artist) }
    pub fn remove_album_artist(&mut self) { self.tag.remove_album_artist() }
    pub fn set_genre(&mut self, genre: &str) { self.tag.set_genre(genre) }
    pub fn remove_genre(&mut self) { self.tag.remove_genre() }
    pub fn set_track_index(&mut self, track_index: u32) { self.tag.set_track(track_index) }
    pub fn remove_track_index(&mut self) { self.tag.remove_track() }
    pub fn set_track_count(&mut self, track_count: u32) { self.tag.set_total_tracks(track_count) }
    pub fn remove_track_count(&mut self) { self.tag.remove_total_tracks() }
    pub fn set_disc_index(&mut self, disc_index: u32) { self.tag.set_disc(disc_index) }
    pub fn remove_disc_index(&mut self) { self.tag.remove_disc() }
    pub fn set_disc_count(&mut self, disc_count: u32) { self.tag.set_total_discs(disc_count) }
    pub fn remove_disc_count(&mut self) { self.tag.remove_total_discs() }
    pub fn set_year(&mut self, year: i32) { self.tag.set_year(year) }
    pub fn remove_year(&mut self) { self.tag.remove("TYER") }
    /// yyyy-MM-ddTHH:mm:ss
    pub fn set_date_recorded(&mut self, timestamp: &str) -> Result<(), JsValue> {
        id3::Timestamp::from_str(timestamp)
            .map(|timestamp| {
                self.tag.set_date_recorded(timestamp);
            })
            .map_err(to_error)
    }
    pub fn set_date_released(&mut self, timestamp: &str) -> Result<(), JsValue> {
        id3::Timestamp::from_str(timestamp)
            .map(|timestamp| {
                self.tag.set_date_released(timestamp);
            })
            .map_err(to_error)
    }
    pub fn set_duration(&mut self, duration_in_seconds: u32) { self.tag.set_duration(duration_in_seconds) }
    pub fn set_publisher(&mut self, publisher: String) {
        self.tag.set_text("TPUB", publisher);
    }    
    pub fn get_uint8array(&self) -> Option<js_sys::Uint8Array> {
        let mut vec: Vec<u8> = Vec::new();
        match self.tag.write_to(&mut vec, id3::Version::Id3v24) {
            Ok(_) => Some(js_sys::Uint8Array::from(&vec[..])),
            Err(_) => None
        }
    }
    /// Puts the tag into the buffer and returns the new buffer.
    /// Not-in-place method. 
    pub fn put_tag_into(&self, buffer: &[u8]) -> Result<js_sys::Uint8Array, JsValue> {
        let mut cursor = std::io::Cursor::new(buffer.to_vec());
        id3::Tag::write_to_with_base(&self.tag, &mut cursor, id3::Version::Id3v24)
            .map(|_| {
                js_sys::Uint8Array::from(&cursor.get_ref()[..])
            })
            .map_err(to_error)
    }
    pub fn add_lyrics(&mut self, lyrics: CommentMetadatum) {
        self.tag.add_lyrics(id3::frame::Lyrics {
            description: lyrics.description,
            lang: lyrics.lang,
            text: lyrics.text
        });
    }
    pub fn get_metadata(&self) -> Metadata {
        Metadata {
            artist: self.tag.artist().map(String::from),
            title: self.tag.title().map(String::from),
            album: self.tag.album().map(String::from),
            album_artist: self.tag.album_artist().map(String::from),
            genre: self.tag.genre().map(String::from),
            track_index: self.tag.track(),
            track_count: self.tag.total_tracks(),
            disc_index: self.tag.disc(),
            disc_count: self.tag.total_discs(),
            year: self.tag.year(),
            date_released: self.tag.date_released(),
            date_recorded: self.tag.date_recorded(),
            duration: self.tag.duration(),
            publisher: self.tag.get("TPUB").and_then(|frame| frame.content().text().map(String::from)),
            comments: self.tag.comments().map(|comment| {
                CommentMetadatum {
                    description: comment.description.to_owned(),
                    lang: comment.lang.to_owned(),
                    text: comment.text.to_owned()
                }
            }).collect(),
            lyrics: self.tag.lyrics().map(|lyrics| {
                CommentMetadatum {
                    description: lyrics.description.to_owned(),
                    lang: lyrics.lang.to_owned(),
                    text: lyrics.text.to_owned()
                }
            }).collect(),
            album_cover: self.tag.pictures().nth(0).map(|picture| {
                AlbumCoverMetadatum {
                    mime_type: picture.mime_type.to_owned(),
                    data: picture.data.to_owned()
                }
            })
        }
    }
}