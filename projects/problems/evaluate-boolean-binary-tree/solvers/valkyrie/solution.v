# blocked: std.collection 数组参数读取
# 题内触发点: evaluateTree 需要 层序数组读取 root 递归求布尔值
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
