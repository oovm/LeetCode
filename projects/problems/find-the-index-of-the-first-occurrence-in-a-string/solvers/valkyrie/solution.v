# 阻塞：std.text 文本索引/构造
# 题内触发点：`haystack⁅i⁆ == needle⁅j⁆` —— KMP 需要按位读字符并比较，失配表还需定长数组。
# 期望语义：文本长度、按下标读字符、字符相等比较。实际：std 文本的下标/长度能力在 intrinsic 清退后未就绪（工具链冻结，无法实跑验证），不开降级绿灯。
# 最小复现（本能力首记）：`micro f(s: text) -> i64 { let c: char = s⁅0⁆ if c == 'a' { return 1 } return s.length() }`，期望编译并逐字读取，实际 std.text 无可用下标/长度入口。
# 理想算法：KMP 前缀函数线性匹配，时间 O(|haystack|+|needle|) 空间 O(|needle|)。
