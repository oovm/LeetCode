# 阻塞：std.text 文本索引/构造
# 题内触发点：`s.split(" ")` 按空格切词并与 `pattern⁅i⁆` 建双向映射 —— 需要文本切分/下标读（映射另需哈希表）。
# 期望语义：文本切分、按下标读字符。实际：std.text 切分/下标能力未就绪（工具链冻结），不开降级绿灯。
# 最小复现：引用 find-the-index-of-the-first-occurrence-in-a-string 的本能力首记复现。
# 理想算法：切词后双映射同步扫描，时间 O(n) 空间 O(词数)。
