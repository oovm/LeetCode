# blocked: std.collection 数组参数读取
# 题内触发点: buildArray 需要 读取 nums 按置换映射
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: #42 的 nums 为 [2,4,6,8,10,1,3,5,7,9]，不是 0..n-1 的置换，Python 参照抛 IndexError，期望为错误串，保持 blocked
