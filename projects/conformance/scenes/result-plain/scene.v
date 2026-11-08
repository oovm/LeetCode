namespace probe.result_plain;

using std.types

micro fine_value(value: i64) -> i64 {
    return value
}

micro fail_value(code: i64) -> i64 {
    return -code
}

# 标量错误载荷：不经自定义联合，直接折出结果。
[export(name: "resultFoldScalar")]
micro result_fold_scalar() -> i64 {
    let failed: Result<i64, i64> = Fail(7)
    let fine: Result<i64, i64> = Fine(42)
    return failed.fold(fine_value, fail_value) + fine.fold(fine_value, fail_value)
}
