# 阻塞：std.text 文本索引/构造
# 题内触发点：`s⁅i⁆` 对手动作 + 上轮己动 + 分差三维 DP（表另需定长数组）。
# 期望语义：文本按下标读字符、切分/拼接/比较/构造。实际：std.text 这些能力在 intrinsic 清退后未就绪（工具链冻结，无法实跑验证），不开降级绿灯。
# 最小复现：引用 find-the-index-of-the-first-occurrence-in-a-string 的本能力首记复现。
# 理想算法：三维 DP，时间 O(n·3·分差界) 空间 O(3·分差界)。
