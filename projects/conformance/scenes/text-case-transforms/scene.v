namespace probe.text_case_transforms;

using std.text

micro checksum(text: utf8) -> i64 {
    let mut total: i64 = 0
    loop current in text {
        total = total + ((current as u32) as i64)
    }
    return total
}

# "Hello" 全大写变成 "HELLO"，码位和 372。
[export(name: "upperChecksum")]
micro upper_checksum() -> i64 {
    let text: utf8 = "Hello"
    return checksum(text.to_upper())
}

# "Hello" 全小写变成 "hello"，码位和 532。
[export(name: "lowerChecksum")]
micro lower_checksum() -> i64 {
    let text: utf8 = "Hello"
    return checksum(text.to_lower())
}

# "a-b-c" 把 '-' 换成 '+' 后长度仍 5，首字符仍是 'a'。
[export(name: "replaceKeepsShape")]
micro replace_keeps_shape() -> i64 {
    let text: utf8 = "a-b-c"
    let replaced: utf8 = text.replace("-", "+")
    let length_code: i64 = replaced.length() as i64
    let first_code: i64 = if replaced.starts_with("a") { 1 } else { 0 }
    return length_code * 10 + first_code
}

# 前缀与后缀同时成立。
[export(name: "affixChecks")]
micro affix_checks() -> i64 {
    let text: utf8 = "prefix-middle-suffix"
    let front: i64 = if text.starts_with("prefix") { 1 } else { 0 }
    let back: i64 = if text.ends_with("suffix") { 1 } else { 0 }
    let middle: i64 = if text.contains("middle") { 1 } else { 0 }
    return front * 100 + middle * 10 + back
}
