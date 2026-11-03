# 阻塞：std.text 文本索引/构造
# 题内触发点：`num⁅i⁆` 取第 i 个数字字符并逐位前移 —— 理想写法需要文本定长下标读与结果串构造。
# 期望语义：文本按下标读字符、按字符拼装新串。实际：std 文本的下标/构造能力在 intrinsic 清退后未就绪（工具链冻结，无法实跑验证），不开降级绿灯。
# 最小复现：引用 find-the-index-of-the-first-occurrence-in-a-string 的本能力首记复现（同批另需树状数组，引用 get-maximum-in-generated-array 的数组复现）。
# 理想算法：贪心逐位取 k 步内可达最小数字前移，树状数组核算已移除位移，时间 O(10n log n) 空间 O(n)。
