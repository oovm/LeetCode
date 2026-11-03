# 阻塞：std.text 文本索引/构造
# 题内触发点：`abbr⁅j⁆` 判数字段并跳 `word⁅i⁆` 对齐 —— 理想写法需要双指针文本下标读。
# 期望语义：文本按下标读字符。实际：std.text 下标/长度能力未就绪（工具链冻结），不开降级绿灯。
# 最小复现：引用 find-the-index-of-the-first-occurrence-in-a-string 的本能力首记复现。
# 理想算法：双指针逐段校验（数字段禁前导零），时间 O(|word|+|abbr|) 空间 O(1)。
