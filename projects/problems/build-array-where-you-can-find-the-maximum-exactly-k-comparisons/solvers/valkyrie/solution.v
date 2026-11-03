# 阻塞：std.collection 数组分配与索引
# 题内触发点：`dp⁅i⁆⁅j⁆⁅max⁆` 三维 DP 表 —— 理想写法需要运行期长度表分配、下标读写（含排序）。
# 期望语义：运行期长度数组分配、下标读写、排序。实际：`⁅ ⁆`/`push`/排序链路在 std 容器内部报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现：引用 get-maximum-in-generated-array 的本能力首记复现。
# 理想算法：三维 DP 前缀和，时间 O(n·m·k) 空间 O(m·k)。
