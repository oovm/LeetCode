# 阻塞：std.text 文本索引/构造
# 题内触发点：`num⁅i⁆` 转十进制后逐位取十六进制并映射 0→O、1→I，校验其余字母 ∈ A-F。
# 期望语义：文本按下标读字符、切分/拼接/比较。实际：std.text 这些能力在 intrinsic 清退后未就绪（工具链冻结，无法实跑验证），不开降级绿灯。
# 最小复现：引用 find-the-index-of-the-first-occurrence-in-a-string 的本能力首记复现。
# 理想算法：进制转换映射校验，时间 O(n) 空间 O(n)。
