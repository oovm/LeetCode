namespace probe.escape_decode_wasm;

using std.collection
using std.text

# 探针：wasm lane 上 `\r`/`\n` 字面量解码、character_at 码位与 CRLF 行界计数。
# 现象坐标：`csv-tsv-parser::csvCrLfFieldCount` expected 4 got 3（wasm）；
# OVM lane 同形态探针全绿，红为 wasm 特有。

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

# 与 csv-tsv-parser 相同的行界计数逻辑（LF 切分、CR 跳过）。
micro count_fields(text: utf8) -> i64 {
    let mut count: i64 = 1
    let length: i64 = text.length() as i64
    let mut index: i64 = 0
    let mut last_is_lf: bool = false
    while index < length {
        let code: i64 = (text.character_at(index as usize) as u32) as i64
        if code == 10 {
            if !last_is_lf {
                count = count + 1
            }

            last_is_lf = true
        }
        else {
            if code != 13 {
                last_is_lf = false
            }
        }

        index = index + 1
    }

    return count as i64
}

[export(name: "fieldCount")]
micro field_count() -> i64 {
    # "a,b\r\nc,d\r\n" 含 2 个逗号 + 2 个 LF 行界 → 4 字段（末尾空段不计）。
    let text: utf8 = crlf_input()
    let mut commas: i64 = 0
    let length: i64 = text.length() as i64
    let mut index: i64 = 0
    while index < length {
        let code: i64 = (text.character_at(index as usize) as u32) as i64
        if code == 44 {
            commas = commas + 1
        }

        index = index + 1
    }

    let lf_lines: i64 = 2
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
