namespace probe.option_alternatives;

using std.types

micro fallback() -> Option<i64> {
    return Some(7)
}

micro twelve() -> i64 {
    return 12
}

# None 经 or_else 恢复为 Some(7)。
[export(name: "optionOrElseRecovers")]
micro option_or_else_recovers() -> i64 {
    let missing: Option<i64> = None
    return missing.or_else(fallback).unwrap_or(-1)
}

# Some(5) 不触发 or_else，原值保留。
[export(name: "optionOrElseSkips")]
micro option_or_else_skips() -> i64 {
    let present: Option<i64> = Some(5)
    return present.or_else(fallback).unwrap_or(-1)
}

# 嵌套 Some(Some(5)) 摊平得 5。
[export(name: "optionFlattenInner")]
micro option_flatten_inner() -> i64 {
    let nested: Option<Option<i64>> = Some(Some(5))
    return nested.flatten().unwrap_or(-1)
}

# 嵌套 Some(None) 摊平后为 None。
[export(name: "optionFlattenMissing")]
micro option_flatten_missing() -> i64 {
    let nested: Option<Option<i64>> = Some(None)
    return nested.flatten().unwrap_or(-1)
}

# None 的 unwrap_or_else 惰性求值得到 12。
[export(name: "optionUnwrapOrElse")]
micro option_unwrap_or_else() -> i64 {
    let missing: Option<i64> = None
    return missing.unwrap_or_else(twelve)
}
