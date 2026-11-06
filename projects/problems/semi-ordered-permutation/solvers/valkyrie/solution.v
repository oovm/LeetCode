# blocked: std.collection 数组参数读取
# 题内触发点: semiOrderedPermutation 需要 读取 nums 找 1 与 n 的位置换次数
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: #21（51 个元素中 1 出现两次、缺 51，期望 "Error: 51 is not in list"）与 #95（39 个元素中 1..5 各出现两次、缺 35..39，期望 "Error: 39 is not in list"）违反 1..n 排列约束，期望是宿主异常串而非整数返回值；其余 99 条按公式一致，原值未改
