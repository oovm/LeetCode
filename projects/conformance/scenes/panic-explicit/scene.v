namespace probe.panic_explicit;

# `panic` 之后没有返回值；按理想语义该出口必须可观察拒绝。
[export(name: "explicitPanic")]
micro explicit_panic() -> i64 {
    panic("probe panic")
}
