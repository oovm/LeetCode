# 阻塞：std.collection 数组分配与索引
# 题内触发点：`dp⁅pos⁆⁅diff⁆⁅mod⁆` —— 数位 DP（偶数位计数-奇数位计数差、模 k 余数、贴合上界）需要三维备忘表。
# 期望语义：运行期长度多维表分配与下标读写。实际：`⁅ ⁆`/`push` 链路在 std 容器内部报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现：引用 get-maximum-in-generated-array 的本能力首记复现。
# 理想算法：f(high)-f(low-1) 两段数位 DP，状态为 (位序, 奇偶差, 余数, 是否已起)，时间 O(位数²·k·10) 空间同。
