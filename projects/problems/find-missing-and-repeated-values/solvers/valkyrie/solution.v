# blocked: std.collection 数组参数读取
# 题内触发点: findMissingAndRepeatedValues 需要 读取 grid 词频找重复与缺失
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: 20 条用例不可用（3、12、15、17、18、31、37、40、41、43、44、52、58、59、66、67、68、73、80、81）：17 条含超出 1..n² 的值（如 #3 的 4×4 含 17），3 条非方阵（#15 为 10×5，#41/#43 为 10×6），期望为错误串或 [x, 100]，保持 blocked
