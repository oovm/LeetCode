# 阻塞：std.text 文本索引/构造
# 题内触发点：`num⁅i⁆` 下一排列迭代 k 次后与原串算邻换逆序数。
# 期望语义：文本按下标读字符、切分/拼接/比较/构造。实际：std.text 这些能力在 intrinsic 清退后未就绪（工具链冻结，无法实跑验证），不开降级绿灯。
# 最小复现：引用 find-the-index-of-the-first-occurrence-in-a-string 的本能力首记复现。
# 理想算法：下一排列加逆序数，时间 O(k·n + n²) 空间 O(n)。
