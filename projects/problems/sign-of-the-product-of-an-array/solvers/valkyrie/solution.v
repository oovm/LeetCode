# blocked: std.collection 数组参数读取
# 题内触发点: arraySign 需要 读取 nums 判断零与负号个数
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: 3 条用例（索引 18、30、51）的 nums 含非整数元素（#18 的 -12.5、6.25），题面要求整数数组，i64 通道无法表达，保持 blocked
