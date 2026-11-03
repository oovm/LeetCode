# blocked: std.collection 数组参数读取
# 题内触发点: kthDistinct 需要 读取 arr 找第 k 个唯一字符串
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
