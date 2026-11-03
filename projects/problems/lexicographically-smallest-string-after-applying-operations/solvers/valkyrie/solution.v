# 阻塞：std.text 文本索引/构造
# 题内触发点：`s⁅i⁆` BFS 枚举加 a/轮转 b 两操作的最小态（队列与集合另需数组/哈希表）。
# 期望语义：文本按下标读字符、切分/拼接/比较/构造。实际：std.text 这些能力在 intrinsic 清退后未就绪（工具链冻结，无法实跑验证），不开降级绿灯。
# 最小复现：引用 find-the-index-of-the-first-occurrence-in-a-string 的本能力首记复现。
# 理想算法：BFS 状态图取最小，时间 O(10·n²) 空间 O(10·n)。
