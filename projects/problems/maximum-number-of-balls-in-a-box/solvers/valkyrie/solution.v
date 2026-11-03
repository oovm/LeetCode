# 阻塞：std.collection 数组分配与索引
# 题内触发点：`let mut count: [i64] = [0; 46]` 配合 `count⁅sum⁆ = count⁅sum⁆ + 1` —— 数位和频率表是理想写法本身。
# 期望语义：定长表分配与下标读写；实际同「数组分配与索引」缺口（unresolved call `<computed>`，`source/_.v:7:1`）。
# 最小复现：引用 get-maximum-in-generated-array 的 inline 复现（同一能力，首记于彼）。
# 理想算法：对每个 x 求数位和 s（≤ 45），频率表计数后取最大。时间 O(n log) 空间 O(46)。
