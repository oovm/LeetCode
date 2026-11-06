# blocked: std.collection 数组参数读取
# 题内触发点: minimumRightShifts 需要 读取 nums 判定右旋有序次数
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: #33/#52/#58/#62/#93/#117 只有一个降序点且位于末位（如 #33 [1,2,3,5,4]/#62 [1,3,2]），右旋任意次数都无法整体有序，期望却为 1；参照公式 n-pivot 漏判 nums[n-1] <= nums[0]，正确结果应为 -1，原值未改
