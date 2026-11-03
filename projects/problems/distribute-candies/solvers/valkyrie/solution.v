# 阻塞：std.collection 数组参数读取
# 题内触发点：`candyType⁅i⁆` 异类计数与 n/2 取小（计数另需定长数组）。
# 期望语义：读取宿主传入数组的长度与下标元素。实际：`⁅ ⁆` 下标链路在 std 容器内部报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现：引用 merge-two-sorted-lists 的本能力首记复现。
# 理想算法：异类数取小，时间 O(n) 空间 O(n)。
