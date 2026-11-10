namespace probe.escape_decode_wasm;

using std.collection
using std.text

# 探针：普通文本的转义由前端语义层解码，OVM 与 Wasm 应消费同一结果。
# 场景名保留用于追踪，不能据旧报告把前端解码问题判成 Wasm 特有。

micro crlf_input() -> utf8 {
    return "a,b\r\nc,d\r\n"
}

[export(name: "inputLength")]
micro input_length() -> i64 {
    return crlf_input().length() as i64
}

[export(name: "crCode")]
micro cr_code() -> i64 {
    let text: utf8 = "\r"
    return (text.character_at(0) as u32) as i64
}

[export(name: "lfCode")]
micro lf_code() -> i64 {
    let text: utf8 = "\n"
    return (text.character_at(0) as u32) as i64
}

[export(name: "fieldCount")]
micro field_count() -> i64 {
    # "a,b\r\nc,d\r\n" 含 2 个逗号 + 2 个 LF 行界 → 4 字段（末尾空段不计）。
    let text: utf8 = crlf_input()
    let mut commas: i64 = 0
    let mut lf_lines: i64 = 0
    let length: i64 = text.length() as i64
    let mut index: i64 = 0
    while index < length {
        let code: i64 = (text.character_at(index as usize) as u32) as i64
        if code == 44 {
            commas = commas + 1
        } else if code == 10 {
            lf_lines = lf_lines + 1
        }

        index = index + 1
    }

    return commas + lf_lines
}

[export(name: "totalChecksum")]
micro total_checksum() -> i64 {
    let text: utf8 = crlf_input()
    let mut total: i64 = 0
    let length: i64 = text.length() as i64
    let mut index: i64 = 0
    while index < length {
        let code: i64 = (text.character_at(index as usize) as u32) as i64
        if code != 13 && code != 10 && code != 44 {
            total = total + code
        }

        index = index + 1
    }

    return total
}
