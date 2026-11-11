namespace probe.string_escape_quote;

# 引号不能用反斜杠越过定界；用单引号包住双引号，由 utf8 上下文定型。
[export(name: "escapedQuoteLength")]
micro escaped_quote_length() -> i64 {
    let text: utf8 = 'a"b'
    return text.length() as i64
}

# 长度相同不代表内容相同：按码位求和锁定 `a` + 双引号 + `b`。
[export(name: "escapedQuoteChecksum")]
micro escaped_quote_checksum() -> i64 {
    let text: utf8 = 'a"b'
    let mut total: i64 = 0
    loop current in text {
        total = total + (current as u32) as i64
    }
    return total
}
