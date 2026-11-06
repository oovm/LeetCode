# blocked: std.collection 数组参数读取
# 题内触发点: numberGame 需要 读取 nums 排序交换输出
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: 5 条用例（21、35、76、89、92）数组长度为奇数（15、15、15、45、15），题面要求偶数长度，Python 参照抛 IndexError，期望为错误串，保持 blocked
