namespace probe.string_escape_quote;

# 引号不能用反斜杠越过定界；用单引号包住双引号，由 utf8 上下文定型。
[export(name: "escapedQuoteLength")]
micro escaped_quote_length() -> i64 {
    let text: utf8 = 'a"b'
    return text.length() as i64
}
