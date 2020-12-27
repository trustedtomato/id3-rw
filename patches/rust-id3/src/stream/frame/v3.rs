use crate::frame::Frame;
use crate::stream::encoding::Encoding;
use crate::stream::frame;
use crate::stream::unsynch;
use crate::tag;
use crate::{Error, ErrorKind};
use bitflags::bitflags;
use byteorder::{BigEndian, ByteOrder, ReadBytesExt, WriteBytesExt};
use flate2::write::ZlibEncoder;
use flate2::Compression;
use std::io;
use std::str;

bitflags! {
    pub struct Flags: u16 {
        const TAG_ALTER_PRESERVATION  = 0x8000;
        const FILE_ALTER_PRESERVATION = 0x4000;
        const READ_ONLY               = 0x2000;
        const COMPRESSION             = 0x0080;
        const ENCRYPTION              = 0x0040;
        const GROUPING_IDENTITY       = 0x0020;
    }
}

pub fn decode(
    mut reader: impl io::Read,
    unsynchronisation: bool,
) -> crate::Result<Option<(usize, Frame)>> {
    let mut frame_header = [0; 10];
    let nread = reader.read(&mut frame_header)?;
    if nread < frame_header.len() || frame_header[0] == 0x00 {
        return Ok(None);
    }
    let id = str::from_utf8(&frame_header[0..4])?;

    let content_size = BigEndian::read_u32(&frame_header[4..8]) as usize;
    let flags = Flags::from_bits(BigEndian::read_u16(&frame_header[8..10]))
        .ok_or_else(|| Error::new(ErrorKind::Parsing, "unknown frame header flags are set"))?;
    if flags.contains(Flags::ENCRYPTION) {
        return Err(Error::new(
            ErrorKind::UnsupportedFeature,
            "encryption is not supported",
        ));
    } else if flags.contains(Flags::GROUPING_IDENTITY) {
        return Err(Error::new(
            ErrorKind::UnsupportedFeature,
            "grouping identity is not supported",
        ));
    }

    let read_size = if flags.contains(Flags::COMPRESSION) {
        let _decompressed_size = reader.read_u32::<BigEndian>()?;
        content_size - 4
    } else {
        content_size
    };
    let content = super::decode_content(
        reader.take(read_size as u64),
        id,
        flags.contains(Flags::COMPRESSION),
        unsynchronisation,
    )?;
    let frame = Frame::with_content(id, content);
    Ok(Some((10 + content_size, frame)))
}

pub fn encode(
    mut writer: impl io::Write,
    frame: &Frame,
    flags: Flags,
    unsynchronization: bool,
) -> crate::Result<usize> {
    let (mut content_buf, comp_hint_delta, decompressed_size) = if flags
        .contains(Flags::COMPRESSION)
    {
        let mut encoder = ZlibEncoder::new(Vec::new(), Compression::default());
        let content_size =
            frame::content::encode(&mut encoder, frame.content(), tag::Id3v23, Encoding::UTF16)?;
        let content_buf = encoder.finish()?;
        (content_buf, 4, Some(content_size))
    } else {
        let mut content_buf = Vec::new();
        frame::content::encode(
            &mut content_buf,
            frame.content(),
            tag::Id3v23,
            Encoding::UTF16,
        )?;
        (content_buf, 0, None)
    };
    if unsynchronization {
        unsynch::encode_vec(&mut content_buf);
    }

    writer.write_all({
        let id = frame.id().as_bytes();
        assert_eq!(4, id.len());
        id
    })?;
    writer.write_u32::<BigEndian>((content_buf.len() + comp_hint_delta) as u32)?;
    writer.write_u16::<BigEndian>(flags.bits())?;
    if let Some(s) = decompressed_size {
        writer.write_u32::<BigEndian>(s as u32)?;
    }
    writer.write_all(&content_buf)?;
    Ok(10 + comp_hint_delta + content_buf.len())
}
