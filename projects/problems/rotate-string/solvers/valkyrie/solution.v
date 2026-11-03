# 阻塞：std.text 文本索引/构造
# 题内触发点：`(s + s).contains(goal)` —— 需要文本拼接与包含判定（或逐偏移比对下标读）。
# 期望语义：文本拼接/包含或下标读。实际：std.text 这些能力未就绪（工具链冻结），不开降级绿灯。
# 最小复现：引用 find-the-index-of-the-first-occurrence-in-a-string 的本能力首记复现。
# 理想算法：倍串包含判定，时间 O(n) 空间 O(n)。
