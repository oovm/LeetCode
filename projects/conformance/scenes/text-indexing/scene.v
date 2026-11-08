namespace probe.text_indexing;

using std.text;

# 逐码位求和：走 `Utf8Text: IntoIterator` 的字符迭代，不用字节下标。
micro checksum(text: utf8) -> i64 {
    let mut total: i64 = 0
    loop ch in text {
        total = total + (ch as u32) as i64
    }
    return total
}

# ASCII：长度按码位，字符码位求和。
[export(name: "asciiChecksum")]
micro ascii_checksum() -> i64 {
    let text: utf8 = "abc"
    return checksum(text)
}

# 多字节 BMP：`é` 与 `中` 都只算一个码位。
[export(name: "bmpChecksum")]
micro bmp_checksum() -> i64 {
    let text: utf8 = "aé中"
    return checksum(text)
}

# 星平面字符：一个码位、四个 UTF-8 字节。
[export(name: "astralChecksum")]
micro astral_checksum() -> i64 {
    let text: utf8 = "🙂"
    return checksum(text)
}

# 按码位切片：从第 1 个码位起取 2 个码位。
[export(name: "sliceChecksum")]
micro slice_checksum() -> i64 {
    let text: utf8 = "héllo"
    let part: utf8 = text.slice(1, 2)
    return checksum(part)
}

# 码位下标（Cardinal 0 基）取字符。
[export(name: "cardinalChar")]
micro cardinal_char() -> i64 {
    let text: utf8 = "aé中"
    let ch: char = text.character_at(2)
    return (ch as u32) as i64
}

# 子串首次出现的码位下标，找不到时返回 -1。
micro position_as_i64(index: usize) -> i64 {
    return index as i64
}

[export(name: "indexOfChar")]
micro index_of_char() -> i64 {
    let text: utf8 = "aé中"
    let found: Option<usize> = text.index_of("中")
    return found.map_or(-1 as i64, position_as_i64)
}

# 按分隔符切分的段数。
[export(name: "splitCount")]
micro split_count() -> i64 {
    let text: utf8 = "a,b,c"
    let parts: [utf8] = text.split(",")
    return parts.length() as i64
}
