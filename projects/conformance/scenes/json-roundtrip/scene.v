namespace probe.json_roundtrip;

using std.collection
using std.text

# 简易 JSON：递归 `unite` 承载值，解析与序列化共用同一棵树。
unite Json {
    [constructor]
    Null
    [constructor]
    Boolean {
        value: bool
    }
    [constructor]
    Numeric {
        value: i64
    }
    [constructor]
    Textual {
        value: utf8
    }
    [constructor]
    Sequence {
        items: ArrayList<Json>
    }
    [constructor]
    Mapping {
        keys: ArrayList<utf8>
        values: ArrayList<Json>
    }
}

unite JsonError {
    [constructor]
    UnexpectedCharacter {
        position: i64
    }
    [constructor]
    UnterminatedText {
        position: i64
    }
    [constructor]
    TrailingContent {
        position: i64
    }
}

micro json_error_code(error: JsonError) -> i64 {
    return match error {
        case UnexpectedCharacter(position): -1
        case UnterminatedText(position): -2
        case TrailingContent(position): -3
    }
}

structure JsonReader {
    text: utf8
    cursor: i64
}

micro reader_new(text: utf8) -> JsonReader {
    return JsonReader { text: text, cursor: 0 }
}

micro reader_length(reader: JsonReader) -> i64 {
    return reader.text.length() as i64
}

micro code_at(reader: JsonReader, offset: i64) -> i64 {
    return (reader.text.character_at(offset as usize) as u32) as i64
}

micro skip_whitespace(mut reader: JsonReader) -> unit {
    let mut skipping: bool = true
    let length: i64 = reader_length(reader)
    while skipping && reader.cursor < length {
        let code: i64 = code_at(reader, reader.cursor)
        if code == 32 || code == 9 || code == 10 || code == 13 {
            reader.cursor = reader.cursor + 1
        } else {
            skipping = false
        }
    }
}

micro is_digit_code(code: i64) -> bool {
    return code >= 48 && code <= 57
}

micro parse_text(mut reader: JsonReader) -> Result<utf8, JsonError> {
    let length: i64 = reader_length(reader)
    reader.cursor = reader.cursor + 1
    let mut buffer: Utf8Builder = Utf8Builder::new(16)
    let newline: char = '\n'
    let tab: char = '\t'
    let quote: char = '"'
    let backslash: char = '\\'
    let mut running: bool = true
    while running && reader.cursor < length {
        let code: i64 = code_at(reader, reader.cursor)
        if code == 34 {
            reader.cursor = reader.cursor + 1
            running = false
        } else if code == 92 {
            reader.cursor = reader.cursor + 1
            if reader.cursor >= length {
                let error: JsonError = UnterminatedText(reader.cursor)
                return Fail(error)
            }
            let escaped: i64 = code_at(reader, reader.cursor)
            if escaped == 110 {
                buffer.append(newline)
            } else if escaped == 116 {
                buffer.append(tab)
            } else if escaped == 34 {
                buffer.append(quote)
            } else {
                buffer.append(backslash)
            }
            reader.cursor = reader.cursor + 1
        } else {
            buffer.append(reader.text.character_at(reader.cursor as usize))
            reader.cursor = reader.cursor + 1
        }
    }
    if running {
        let error: JsonError = UnterminatedText(reader.cursor)
        return Fail(error)
    }
    let value: utf8 = buffer.build()
    return Fine(value)
}

micro expect_word(mut reader: JsonReader, word: utf8) -> bool {
    let length: i64 = reader_length(reader)
    let width: i64 = word.length() as i64
    if reader.cursor + width > length {
        return false
    }
    let part: utf8 = reader.text.slice(reader.cursor as usize, width as usize)
    if part != word {
        return false
    }
    reader.cursor = reader.cursor + width
    return true
}

micro parse_number(mut reader: JsonReader) -> i64 {
    let length: i64 = reader_length(reader)
    let mut negative: bool = false
    if code_at(reader, reader.cursor) == 45 {
        negative = true
        reader.cursor = reader.cursor + 1
    }
    let mut magnitude: i64 = 0
    let mut scanning: bool = true
    while scanning && reader.cursor < length {
        let code: i64 = code_at(reader, reader.cursor)
        if is_digit_code(code) {
            magnitude = magnitude * 10 + (code - 48)
            reader.cursor = reader.cursor + 1
        } else {
            scanning = false
        }
    }
    if negative {
        return 0 - magnitude
    }
    return magnitude
}

micro parse_array(mut reader: JsonReader) -> Result<Json, JsonError> {
    reader.cursor = reader.cursor + 1
    let mut items: ArrayList<Json> = ArrayList::new(8)
    skip_whitespace(reader)
    if reader.cursor < reader_length(reader) && code_at(reader, reader.cursor) == 93 {
        reader.cursor = reader.cursor + 1
        return Fine(Sequence { items: items })
    }
    let mut running: bool = true
    while running {
        let parsed: Result<Json, JsonError> = parse_value(reader)
        let item: Json = match parsed {
            case Fine(value): value
            case Fail(error): return Fail(error)
        }
        items.push(item)
        skip_whitespace(reader)
        if reader.cursor >= reader_length(reader) {
            let error: JsonError = UnexpectedCharacter(reader.cursor)
            return Fail(error)
        }
        let separator: i64 = code_at(reader, reader.cursor)
        if separator == 44 {
            reader.cursor = reader.cursor + 1
            skip_whitespace(reader)
        } else if separator == 93 {
            reader.cursor = reader.cursor + 1
            running = false
        } else {
            let error: JsonError = UnexpectedCharacter(reader.cursor)
            return Fail(error)
        }
    }
    return Fine(Sequence { items: items })
}

micro parse_object(mut reader: JsonReader) -> Result<Json, JsonError> {
    reader.cursor = reader.cursor + 1
    let mut keys: ArrayList<utf8> = ArrayList::new(8)
    let mut values: ArrayList<Json> = ArrayList::new(8)
    skip_whitespace(reader)
    if reader.cursor < reader_length(reader) && code_at(reader, reader.cursor) == 125 {
        reader.cursor = reader.cursor + 1
        return Fine(Mapping { keys: keys, values: values })
    }
    let mut running: bool = true
    while running {
        skip_whitespace(reader)
        if reader.cursor >= reader_length(reader) || code_at(reader, reader.cursor) != 34 {
            let error: JsonError = UnexpectedCharacter(reader.cursor)
            return Fail(error)
        }
        let parsed_key: Result<utf8, JsonError> = parse_text(reader)
        let key: utf8 = match parsed_key {
            case Fine(value): value
            case Fail(error): return Fail(error)
        }
        skip_whitespace(reader)
        if reader.cursor >= reader_length(reader) || code_at(reader, reader.cursor) != 58 {
            let error: JsonError = UnexpectedCharacter(reader.cursor)
            return Fail(error)
        }
        reader.cursor = reader.cursor + 1
        skip_whitespace(reader)
        let parsed_value: Result<Json, JsonError> = parse_value(reader)
        let value: Json = match parsed_value {
            case Fine(inner): inner
            case Fail(error): return Fail(error)
        }
        keys.push(key)
        values.push(value)
        skip_whitespace(reader)
        if reader.cursor >= reader_length(reader) {
            let error: JsonError = UnexpectedCharacter(reader.cursor)
            return Fail(error)
        }
        let separator: i64 = code_at(reader, reader.cursor)
        if separator == 44 {
            reader.cursor = reader.cursor + 1
        } else if separator == 125 {
            reader.cursor = reader.cursor + 1
            running = false
        } else {
            let error: JsonError = UnexpectedCharacter(reader.cursor)
            return Fail(error)
        }
    }
    return Fine(Mapping { keys: keys, values: values })
}

micro parse_value(mut reader: JsonReader) -> Result<Json, JsonError> {
    skip_whitespace(reader)
    if reader.cursor >= reader_length(reader) {
        let error: JsonError = UnexpectedCharacter(reader.cursor)
        return Fail(error)
    }
    let code: i64 = code_at(reader, reader.cursor)
    if code == 34 {
        let parsed: Result<utf8, JsonError> = parse_text(reader)
        return match parsed {
            case Fine(value): Fine(Textual { value: value })
            case Fail(error): Fail(error)
        }
    }
    if code == 91 {
        return parse_array(reader)
    }
    if code == 123 {
        return parse_object(reader)
    }
    if code == 116 {
        if expect_word(reader, "true") {
            return Fine(Boolean { value: true })
        }
    }
    if code == 102 {
        if expect_word(reader, "false") {
            return Fine(Boolean { value: false })
        }
    }
    if code == 110 {
        if expect_word(reader, "null") {
            let empty: Json = Null
            return Fine(empty)
        }
    }
    if code == 45 || is_digit_code(code) {
        return Fine(Numeric { value: parse_number(reader) })
    }
    let error: JsonError = UnexpectedCharacter(reader.cursor)
    return Fail(error)
}

micro parse_json(text: utf8) -> Result<Json, JsonError> {
    let mut reader: JsonReader = reader_new(text)
    let parsed: Result<Json, JsonError> = parse_value(reader)
    let value: Json = match parsed {
        case Fine(inner): inner
        case Fail(error): return Fail(error)
    }
    skip_whitespace(reader)
    if reader.cursor < reader_length(reader) {
        let error: JsonError = TrailingContent(reader.cursor)
        return Fail(error)
    }
    return Fine(value)
}

micro write_text(value: utf8) -> utf8 {
    let mut buffer: Utf8Builder = Utf8Builder::new(16)
    let quote: char = '"'
    let backslash: char = '\\'
    let letter_n: char = 'n'
    buffer.append(quote)
    loop current in value {
        let code: i64 = (current as u32) as i64
        if code == 34 {
            buffer.append(backslash)
            buffer.append(quote)
        } else if code == 92 {
            buffer.append(backslash)
            buffer.append(backslash)
        } else if code == 10 {
            buffer.append(backslash)
            buffer.append(letter_n)
        } else {
            buffer.append(current)
        }
    }
    buffer.append(quote)
    return buffer.build()
}

micro write_json(value: Json) -> utf8 {
    return match value {
        case Null: "null"
        case Boolean(flag): if flag { "true" } else { "false" }
        case Numeric(number): number.display()
        case Textual(text): write_text(text)
        case Sequence(items):
            let mut buffer: Utf8Builder = Utf8Builder::new(16)
            let open: char = '['
            let close: char = ']'
            let comma: char = ','
            buffer.append(open)
            let mut index: usize = 0
            while index < items.length() {
                if index > 0 {
                    buffer.append(comma)
                }
                buffer.append(write_json(items⁅index⁆))
                index = index + 1
            }
            buffer.append(close)
            buffer.build()
        case Mapping(keys, values):
            let mut buffer: Utf8Builder = Utf8Builder::new(16)
            let open: char = '\{'
            let close: char = '\}'
            let comma: char = ','
            let colon: char = ':'
            buffer.append(open)
            let mut index: usize = 0
            while index < keys.length() {
                if index > 0 {
                    buffer.append(comma)
                }
                buffer.append(write_text(keys⁅index⁆))
                buffer.append(colon)
                buffer.append(write_json(values⁅index⁆))
                index = index + 1
            }
            buffer.append(close)
            buffer.build()
    }
}

micro text_checksum(text: utf8) -> i64 {
    let mut total: i64 = 0
    loop current in text {
        total = total + ((current as u32) as i64)
    }
    return total
}

# V 原样文本只负责承载 JSON，JSON 内部的引号和反斜杠由 JSON 解析器解释。
micro json_sample_text() -> utf8 {
    return r'{"a":[1,2],"b":true}'
}

micro json_escaped_text() -> utf8 {
    return r'"a\"b\\c"'
}

# "[1,2,3]" 解析后数组长度 3。
[export(name: "jsonArrayLength")]
micro json_array_length() -> i64 {
    let parsed: Result<Json, JsonError> = parse_json("[1,2,3]")
    return match parsed {
        case Fine(value):
            match value {
                case Sequence(items): items.length() as i64
                else: -9
            }
        case Fail(error): json_error_code(error)
    }
}

# `{"a":[1,2],"b":true}` 解析再序列化，规范文本校验和 1514。
[export(name: "jsonRoundTripChecksum")]
micro json_round_trip_checksum() -> i64 {
    let parsed: Result<Json, JsonError> = parse_json(json_sample_text())
    return match parsed {
        case Fine(value): text_checksum(write_json(value))
        case Fail(error): json_error_code(error)
    }
}

# 字符串转义往返：`"a\"b\\c"` 内容 `a"b\c` 校验和 420。
[export(name: "jsonEscapedChecksum")]
micro json_escaped_checksum() -> i64 {
    let parsed: Result<Json, JsonError> = parse_json(json_escaped_text())
    return match parsed {
        case Fine(value):
            match value {
                case Textual(text): text_checksum(text)
                else: -9
            }
        case Fail(error): json_error_code(error)
    }
}

# 未闭合数组：走错误链返回 -1。
[export(name: "jsonMalformedCode")]
micro json_malformed_code() -> i64 {
    let parsed: Result<Json, JsonError> = parse_json("[1,2")
    return match parsed {
        case Fine(value): 0
        case Fail(error): json_error_code(error)
    }
}

# `null` 往返仍为 `null`，校验和 443。
[export(name: "jsonNullChecksum")]
micro json_null_checksum() -> i64 {
    let parsed: Result<Json, JsonError> = parse_json("null")
    return match parsed {
        case Fine(value): text_checksum(write_json(value))
        case Fail(error): json_error_code(error)
    }
}
