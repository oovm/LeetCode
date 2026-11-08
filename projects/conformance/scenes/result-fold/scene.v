namespace probe.result_fold;

using std.types

unite FoldError {
    [constructor]
    Broken {
        code: i64
    }
}

micro fine_value(value: i64) -> i64 {
    return value
}

micro fail_value(error: FoldError) -> i64 {
    match error {
        case Broken(code): {
            return -code
        }
    }
}

# Result 的 fold 需要两个方向的处理函数。
[export(name: "resultFold")]
micro result_fold() -> i64 {
    let failed: Result<i64, FoldError> = Fail(Broken { code: 7 })
    let fine: Result<i64, FoldError> = Fine(42)
    let failed_value: i64 = failed.fold(fine_value, fail_value)
    let fine_total: i64 = fine.fold(fine_value, fail_value)
    return failed_value + fine_total
}
