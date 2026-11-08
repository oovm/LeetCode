namespace probe.string_escape_quote;

# 文档承诺普通字符串里 `\"` 是可用的转义序列；此场景按文档写法保留。
[export(name: "escapedQuoteLength")]
micro escaped_quote_length() -> i64 {
    let text: utf8 = "a\"b"
    return text.length() as i64
}
