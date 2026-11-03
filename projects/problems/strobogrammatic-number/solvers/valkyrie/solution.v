# 阻塞：std.text 文本索引/构造
# 题内触发点：`num⁅i⁆` 与 `num⁅len-1-i⁆` 对位读字符并查旋转对（0/1/8 自旋、6/9 互旋）。
# 期望语义：文本按下标读字符。实际：std.text 下标/长度能力未就绪（工具链冻结），不开降级绿灯。
# 最小复现：引用 find-the-index-of-the-first-occurrence-in-a-string 的本能力首记复现。
# 理想算法：双指针对位校验，时间 O(n) 空间 O(1)。
