# 阻塞：std.collection 数组分配与排序
# 题内触发点：`pairs⁅i⁆ = (power(x), x)` 后 `pairs.sort()` 取第 k 项 —— 需要运行期数组与排序。
# 期望语义：运行期长度数组分配、下标读写与排序。实际：`⁅ ⁆`/`push`/排序链路在 std 容器内部报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现：引用 get-maximum-in-generated-array 的数组分配首记复现（排序同属容器缺口）。
# 理想算法：逐值算 Collatz 幂值后按 (幂值, 数值) 排序取第 k 个，时间 O(n log n + n·幂值上界) 空间 O(n)。
