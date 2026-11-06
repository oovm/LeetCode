# blocked: std.collection 数组参数读取
# 题内触发点: largestSumAfterKNegations 需要 读取 nums 排序后翻转最小值
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: #106 的 nums 含 -200..-500 超出题面下界 -100，期望 -1500 与 TypeScript 参照 300 矛盾（Python 参照只对 [-100,100] 建表），保持 blocked
