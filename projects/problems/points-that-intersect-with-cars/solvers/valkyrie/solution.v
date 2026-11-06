# blocked: std.collection 数组参数读取
# 题内触发点: numberOfPoints 需要 读取 nums 统计区间覆盖点
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: 5 条用例（17、50、54、62、78）区间右端点超过 100（如 #17 的 [200, 300]），Python 参照抛 IndexError，期望为错误串，保持 blocked
