# 阻塞：std.text 文本索引/构造
# 题内触发点：`s⁅i⁆` 回溯切分唯一子串集（集合另需哈希表）。
# 期望语义：文本按下标读字符、切分/拼接/比较/构造。实际：std.text 这些能力在 intrinsic 清退后未就绪（工具链冻结，无法实跑验证），不开降级绿灯。
# 最小复现：引用 find-the-index-of-the-first-occurrence-in-a-string 的本能力首记复现。
# 理想算法：回溯枚举切分，时间 O(2^n) 空间 O(n)。
