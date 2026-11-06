# blocked: std.collection 数组参数读取
# 题内触发点: countSubarrays 需要 读取 nums 统计满足条件的长度为 3 的子数组
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: 3 条用例（索引 28、33、124）的 nums 含小数（#28 的 37.5、#33 的 10.5、#124 的 148.5/247.5），题面要求整数数组，i64 通道无法表达；三条期望均为 0，原值未改，保持 blocked
