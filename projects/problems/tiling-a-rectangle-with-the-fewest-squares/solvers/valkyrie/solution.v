# 阻塞：std.collection 数组分配与索引
# 题内触发点：`let mut grid: [[i64]] = ...` 剖面回溯需要 n×m 占用表 / 高度剖面表按行列下标读写。
# 期望语义：运行期长度二维表分配与下标读写。实际：`⁅ ⁆`/`push` 链路在 std 容器内部报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现：引用 get-maximum-in-generated-array 的本能力首记复现。
# 理想算法：回溯逐格填最大可行正方形并记忆化剖面，时间 O(指数·nm) 空间 O(nm)。
