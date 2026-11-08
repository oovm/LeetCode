namespace probe.closure_capture;

# 闭包按值捕获参数后逃逸出函数，调用方拿到的是可反复使用的函数值。
micro make_scaler(factor: i64) -> micro(i64) -> i64 {
    let scaled: micro(i64) -> i64 = micro(x: i64) -> i64 { return x * factor }
    return scaled
}

micro make_shifter(base: i64) -> micro(i64) -> i64 {
    let shifted: micro(i64) -> i64 = micro(x: i64) -> i64 { return base + x }
    return shifted
}

[export(name: "closureCaptureSum")]
micro closure_capture_sum() -> i64 {
    let doubled: micro(i64) -> i64 = make_scaler(2)
    let shifted: micro(i64) -> i64 = make_shifter(7)
    return shifted(doubled(5))
}

# 块内局部变量被闭包捕获，闭包本身不逃逸。
[export(name: "localCapture")]
micro local_capture() -> i64 {
    let base: i64 = 10
    let add_base: micro(i64) -> i64 = micro(x: i64) -> i64 { return base + x }
    return add_base(5)
}
