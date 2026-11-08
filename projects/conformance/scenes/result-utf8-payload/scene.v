namespace probe.result_utf8_payload;

using std.types

micro fine_value(value: i64) -> i64 {
    return value
}

micro fail_value(message: utf8) -> i64 {
    return -1
}

# 文本作为错误载荷：错误消息原样携带，折叠时只取码值。
[export(name: "resultFoldUtf8")]
micro result_fold_utf8() -> i64 {
    let failed: Result<i64, utf8> = Fail("boom")
    let fine: Result<i64, utf8> = Fine(42)
    return failed.fold(fine_value, fail_value) + fine.fold(fine_value, fail_value)
}
