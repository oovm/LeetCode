# 阻塞：std.collection 数组参数读取
# 题内触发点：`nums⁅i⁆` 频次表差 1 配对（计数另需哈希表）。
# 期望语义：读取宿主传入数组的长度与下标元素。实际：`⁅ ⁆` 下标链路在 std 容器内部报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现：引用 merge-two-sorted-lists 的本能力首记复现。
# 理想算法：频次配对，时间 O(n) 空间 O(n)。
