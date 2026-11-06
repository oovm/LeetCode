# blocked: std.collection 数组参数读取
# 题内触发点: maximumPopulation 需要 读取 logs 统计人口最多年份
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: #33 的 [2045, 2055] 死亡年份 2055 超出题面上界 2050，Python 参照抛 IndexError，期望为错误串，保持 blocked
