namespace probe.panic_traps;

using std.types

# 除数为零应可观察地拒绝，而不是返回某个数值。
[export(name: "divisionByZero")]
micro division_by_zero() -> i64 {
    let divisor: i64 = 0
    return 10 / divisor
}

# `None` 上 `unwrap` 应可观察地拒绝。
[export(name: "unwrapNone")]
micro unwrap_none() -> i64 {
    let missing: Option<i64> = None
    return missing.unwrap()
}

# 对照：非空 `Option` 的 `unwrap` 正常返回值。
[export(name: "unwrapSome")]
micro unwrap_some() -> i64 {
    let present: Option<i64> = Some(42)
    return present.unwrap()
}
