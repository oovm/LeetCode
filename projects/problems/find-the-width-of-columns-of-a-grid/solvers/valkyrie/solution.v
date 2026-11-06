# blocked: std.collection 数组参数读取
# 题内触发点: findColumnWidth 需要 读取 grid 求各列最长字符串宽度
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: #41 的 grid 三行长度分别为 5、5、4（列长不一致），期望 [9, 10, 8, 8] 按 4 列给出，保持 blocked
