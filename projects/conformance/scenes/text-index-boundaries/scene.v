namespace probe.text_index_boundaries;

using std.text

micro position_as_i64(index: Option<usize>) -> i64 {
    if index.is_some() {
        return index.unwrap() as i64
    }
    return -1
}

# 空串长度必须是 0。
[export(name: "emptyLength")]
micro empty_length() -> i64 {
    let empty: utf8 = ""
    return empty.length() as i64
}

# 空串查找空模式：按 std 合同返回码位下标 0。
[export(name: "emptyIndexOf")]
micro empty_index_of() -> i64 {
    let empty: utf8 = ""
    let found: Option<usize> = empty.index_of("")
    return position_as_i64(found)
}

# 单字节串取第一个码位，并只切一个码位。
[export(name: "singleByteSlice")]
micro single_byte_slice() -> i64 {
    let text: utf8 = "a"
    let part: utf8 = text.slice(0, 1)
    return (part.character_at(0) as u32) as i64
}

# 星平面字符之后起切：切片边界不跨代理对。
[export(name: "astralSliceChar")]
micro astral_slice_char() -> i64 {
    let text: utf8 = "🙂x"
    let part: utf8 = text.slice(1, 1)
    return (part.character_at(0) as u32) as i64
}

# 星平面字符各算一个码位。
[export(name: "astralLength")]
micro astral_length() -> i64 {
    let text: utf8 = "🙂a🙂"
    return text.length() as i64
}

# 重叠匹配：`"aa"` 在 `"aaaa"` 里出现在下标 0、1、2。
[export(name: "overlapMatches")]
micro overlap_matches() -> i64 {
    let text: utf8 = "aaaa"
    let pattern: utf8 = "aa"
    let total: usize = text.length()
    let mut offset: usize = 0
    let mut count: i64 = 0
    let mut scanning: bool = true
    while scanning && offset <= total {
        let window: utf8 = text.slice(offset, total - offset)
        let found: Option<usize> = window.index_of(pattern)
        if found.is_some() {
            count = count + 1
            offset = offset + found.unwrap() + 1
        } else {
            scanning = false
        }
    }
    return count
}
