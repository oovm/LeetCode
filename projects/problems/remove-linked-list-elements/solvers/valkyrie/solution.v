# 阻塞：std.collection 数组参数读取
# 题内触发点：`head⁅i⁆` 读值数组过滤 val 重建。
# 期望语义：读取宿主传入数组的长度与下标元素。实际：`⁅ ⁆` 下标链路在 std 容器内部报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现：引用 merge-two-sorted-lists 的本能力首记复现。
# 理想算法：过滤重建，时间 O(n) 空间 O(n)。
