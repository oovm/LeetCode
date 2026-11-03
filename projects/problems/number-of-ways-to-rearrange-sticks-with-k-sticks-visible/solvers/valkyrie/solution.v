# 阻塞：std.collection 数组分配与索引
# 题内触发点：`dp⁅i⁆⁅j⁆ = (dp⁅i-1⁆⁅j-1⁆ + (i-1)·dp⁅i-1⁆⁅j⁆) % M` —— 第一类 Stirling 无符号递推需要 1000×1000 表。
# 期望语义：运行期长度二维表分配与下标读写。实际：`⁅ ⁆`/`push` 链路在 std 容器内部报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现：引用 get-maximum-in-generated-array 的本能力首记复现。
# 理想算法：第一类无符号 Stirling 数二维递推，时间 O(nk) 空间 O(nk)。
