# 阻塞：std.text 文本索引/构造
# 题内触发点：`state⁅i⁆` 枚举 ++ 翻为 -- 后递归判对手必败（备忘另需哈希表）。
# 期望语义：文本按下标读字符、切分/拼接/比较/构造。实际：std.text 这些能力在 intrinsic 清退后未就绪（工具链冻结，无法实跑验证），不开降级绿灯。
# 最小复现：引用 find-the-index-of-the-first-occurrence-in-a-string 的本能力首记复现。
# 理想算法：记忆化博弈递归，时间约 O(n·2^n) 空间 O(n)。
