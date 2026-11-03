# 阻塞：std.collection 数组分配与索引
# 题内触发点：`dp⁅i⁆⁅a⁆⁅b⁆ = Σ dp⁅i-1⁆⁅b⁆⁅c⁆`（gcd(a,c)==1 且 c≠a、b）—— n≤10⁴ 的三维滚动表。
# 期望语义：运行期长度多维表分配与下标读写。实际：`⁅ ⁆`/`push` 链路在 std 容器内部报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现：引用 get-maximum-in-generated-array 的本能力首记复现。
# 理想算法：以上两骰面为状态的滚动 DP，时间 O(n·6³) 空间 O(6²)。
