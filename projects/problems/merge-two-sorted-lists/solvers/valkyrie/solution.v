# 阻塞：std.collection 数组参数读取
# 题内触发点：`list1⁅i⁆` 与 `list2⁅j⁆` 双指针读宿主传入数组并归并。
# 期望语义：读取宿主传入数组的长度与下标元素。实际：`⁅ ⁆` 下标链路在 std 容器内部报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现（本能力首记）：`micro f(a: [i64]) -> i64 { return a⁅0⁆ + a.length() }`，期望读取宿主数组首元素与长度，实际 unresolved call `<computed>`。
# 理想算法：双指针归并，时间 O(m+n) 空间 O(m+n)。
