# blocked: std.collection 数组参数读取
# 题内触发点: findChampion 需要 读取 grid 找全胜队
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: 44/56 条用例输入不存在全胜队（如 #2 的 3×3 石头剪刀布循环），期望 null 与 Python 参照一致而 TypeScript 参照返回 -1，题面保证冠军存在，保持 blocked
