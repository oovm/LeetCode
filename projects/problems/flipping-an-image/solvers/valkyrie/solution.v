# blocked: std.collection 数组参数读取
# 题内触发点: flipAndInvertImage 需要 读取 image 逐行反转取反
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: 8 条用例期望值与参照解不一致（如全 1 行期望半 0 半 1），保持 blocked
