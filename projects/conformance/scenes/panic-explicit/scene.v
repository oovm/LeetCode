namespace probe.panic_explicit;

# `raise` 之后没有正常返回路径；该出口必须可观察拒绝。
# 语言没有「void 调用隐式底类型」规则，显式失败用 `raise` 表达。
[export(name: "explicitPanic")]
micro explicit_panic() -> i64 {
    raise "probe panic"
}
