# 阻塞：std.collection 数组分配与索引
# 题内触发点：`dp⁅state⁆ = Σ dp'⁅prev⁆` —— 列状态（3^m）枚举与逐列转移需要状态表按下标读写。
# 期望语义：运行期长度表分配与下标读写。实际：`⁅ ⁆`/`push` 链路在 std 容器内部报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现：引用 get-maximum-in-generated-array 的本能力首记复现。
# 理想算法：枚举无相邻同色的列状态并预筛相容对，逐列滚动 DP，时间 O(n·3^2m) 空间 O(3^m)。
