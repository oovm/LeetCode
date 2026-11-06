# blocked: metadata.tests 的 edges 与 succProb 长度不一致
# 题内触发点: maxProbability 需要按边下标读取 succProb
# 期望语义: 每条 edges[i] 都有对应的 succProb[i]
# 实际报错: tests[24] 的 edges 9 条、succProb 8 个，读取 succProb⁅8⁆ 越界 trap
# 最小复现: projects/problems/path-with-maximum-probability/solvers/valkyrie/solution.v:82 的 succProb⁅edge_index⁆
# corpusDefect: 8 条用例（索引 20、24、31、40、44、49、62、63）的 edges 与 succProb 长度不一致，期望值由 TypeScript 侧 undefined 乘算静默得到，原用例与期望不动，保持 blocked
