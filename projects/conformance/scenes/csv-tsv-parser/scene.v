namespace probe.csv_tsv_parser;

using std.collection
using std.text

# CSV/TSV 解析：引号内逗号不分割，`""` 转义为单个引号，CRLF 与 LF 都算行界，空字段保留。
unite CsvError {
    [constructor]
    UnterminatedQuote {
        position: i64
    }
    [constructor]
    UnexpectedQuote {
        position: i64
    }
}

micro csv_error_code(error: CsvError) -> i64 {
    return match error {
        case UnterminatedQuote(position): -1
        case UnexpectedQuote(position): -2
    }
}

# 平铺返回全部字段，行界与逗号等价（行结构由调用方按行宽还原）。
micro parse_csv(text: utf8) -> Result<ArrayList<utf8>, CsvError> {
    let mut fields: ArrayList<utf8> = ArrayList::new(8)
    let mut buffer: Utf8Builder = Utf8Builder::new(16)
    let length: i64 = text.length() as i64
    let mut index: i64 = 0
    let mut quoted: bool = false
    let mut field_started: bool = false
    let mut last_was_comma: bool = false
    while index < length {
        let current: char = text.character_at(index as usize)
        if quoted {
            if current == '"' {
                if index + 1 < length && text.character_at((index + 1) as usize) == '"' {
                    buffer.append(current)
                    index = index + 2
                } else {
                    quoted = false
                    index = index + 1
                }
            } else {
                buffer.append(current)
                index = index + 1
            }
        } else if current == '"' {
            if field_started {
                let error: CsvError = UnexpectedQuote(index)
                return Fail(error)
            }
            quoted = true
            field_started = true
            index = index + 1
        } else if current == ',' {
            let field: utf8 = buffer.build()
            fields.push(field)
            buffer = Utf8Builder::new(16)
            field_started = false
            last_was_comma = true
            index = index + 1
        } else if current == '\r' {
            index = index + 1
        } else if current == '\n' {
            let field: utf8 = buffer.build()
            fields.push(field)
            buffer = Utf8Builder::new(16)
            field_started = false
            last_was_comma = false
            index = index + 1
        } else {
            buffer.append(current)
            field_started = true
            last_was_comma = false
            index = index + 1
        }
    }
    if quoted {
        let error: CsvError = UnterminatedQuote(length)
        return Fail(error)
    }
    if field_started || last_was_comma {
        let field: utf8 = buffer.build()
        fields.push(field)
    }
    return Fine(fields)
}

micro field_checksum(field: utf8) -> i64 {
    let mut total: i64 = 0
    loop current in field {
        total = total + ((current as u32) as i64)
    }
    return total
}

# "a,b,,c"：4 个字段，其中第 3 个为空。
[export(name: "csvFieldCount")]
micro csv_field_count() -> i64 {
    let parsed: Result<ArrayList<utf8>, CsvError> = parse_csv("a,b,,c")
    return match parsed {
        case Fine(fields): fields.length() as i64
        case Fail(error): csv_error_code(error)
    }
}

# 输入为 '"x,y",z'：引号内逗号不分割，两字段校验和 285 + 122。
[export(name: "csvQuotedCommaChecksum")]
micro csv_quoted_comma_checksum() -> i64 {
    let input: utf8 = '"x,y",z'
    let parsed: Result<ArrayList<utf8>, CsvError> = parse_csv(input)
    return match parsed {
        case Fine(fields):
            let mut total: i64 = 0
            let mut index: usize = 0
            while index < fields.length() {
                total = total + field_checksum(fields⁅index⁆)
                index = index + 1
            }
            total
        case Fail(error): csv_error_code(error)
    }
}

# CSV 的双写引号展开为单个引号，首字段 he said "hi" 的校验和 963。
[export(name: "csvEscapedQuoteChecksum")]
micro csv_escaped_quote_checksum() -> i64 {
    let input: utf8 = '"he said ""hi""",2'
    let parsed: Result<ArrayList<utf8>, CsvError> = parse_csv(input)
    return match parsed {
        case Fine(fields): field_checksum(fields⁅0⁆)
        case Fail(error): csv_error_code(error)
    }
}

# "a,b\r\nc,d\r\n"：CRLF 与 LF 同为行界，共 4 个字段。
[export(name: "csvCrLfFieldCount")]
micro csv_crlf_field_count() -> i64 {
    let parsed: Result<ArrayList<utf8>, CsvError> = parse_csv("a,b\r\nc,d\r\n")
    return match parsed {
        case Fine(fields): fields.length() as i64
        case Fail(error): csv_error_code(error)
    }
}

# 引号未闭合：走错误链返回 -1。
[export(name: "csvUnterminatedCode")]
micro csv_unterminated_code() -> i64 {
    let input: utf8 = 'a,"b'
    let parsed: Result<ArrayList<utf8>, CsvError> = parse_csv(input)
    return match parsed {
        case Fine(fields): fields.length() as i64
        case Fail(error): csv_error_code(error)
    }
}

# 字段中途出现引号：UnexpectedQuote，返回 -2。
[export(name: "csvUnexpectedQuoteCode")]
micro csv_unexpected_quote_code() -> i64 {
    let input: utf8 = 'a"b'
    let parsed: Result<ArrayList<utf8>, CsvError> = parse_csv(input)
    return match parsed {
        case Fine(fields): fields.length() as i64
        case Fail(error): csv_error_code(error)
    }
}
