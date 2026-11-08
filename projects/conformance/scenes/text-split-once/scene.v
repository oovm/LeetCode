namespace probe.text_split_once;

using std.text

# "a=1" 在 '=' 处切一次：head 是 "a"，tail 是 "1"。
[export(name: "splitOnceParts")]
micro split_once_parts() -> i64 {
    let text: utf8 = "a=1"
    let parts: Option<SplitParts> = text.split_once("=")
    if parts.is_none() {
        return -1
    }
    let pair: SplitParts = parts.unwrap()
    let head_ok: i64 = if pair.head.equals("a") { 1 } else { 0 }
    let tail_ok: i64 = if pair.tail.equals("1") { 1 } else { 0 }
    return head_ok * 10 + tail_ok
}

# "a=b=c" 只切第一处，tail 保留剩下的 "b=c"。
[export(name: "splitOnceKeepsRest")]
micro split_once_keeps_rest() -> i64 {
    let text: utf8 = "a=b=c"
    let parts: Option<SplitParts> = text.split_once("=")
    if parts.is_none() {
        return -1
    }
    let pair: SplitParts = parts.unwrap()
    return (pair.tail.length() as i64) * 10 + (pair.tail.index_of("=").unwrap_or(9) as i64)
}

# 没有分隔符时 split_once 返回 None。
[export(name: "splitOnceMissing")]
micro split_once_missing() -> i64 {
    let text: utf8 = "abc"
    let parts: Option<SplitParts> = text.split_once("=")
    if parts.is_none() {
        return -1
    }
    return 0
}

# 空白切分："  alpha beta   gamma " 得到三段，长度和 14。
[export(name: "splitWhitespaceCount")]
micro split_whitespace_count() -> i64 {
    let text: utf8 = "  alpha beta   gamma "
    let segments: [utf8] = text.split_whitespace()
    let mut total: i64 = 0
    loop segment in segments {
        total = total + (segment.length() as i64)
    }
    return total
}
