# 阻塞：std.collection 数组分配与索引
# 题内触发点：`dp⁅row⁆⁅state⁆⁅intro⁆⁅extro⁆ = ...` —— 逐行三态剖面 DP 需要多维表按下标读写。
# 期望语义：运行期长度多维表分配与下标读写。实际：`⁅ ⁆`/`push` 链路在 std 容器内部报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现：引用 get-maximum-in-generated-array 的本能力首记复现。
# 理想算法：枚举行内三态放置（3^n）并按上行剖面转移，时间 O(m·3^2n·intro·extro) 空间 O(3^n·intro·extro)。
