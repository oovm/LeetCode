# blocked: std.collection 数组参数读取
# 题内触发点: separateDigits 需要 读取 nums 逐位拆分拼接
# 期望语义: 宿主传入的数组参数可直接索引与遍历
# 实际报错: unresolved call <computed>（数组参数读取不被支持）
# 最小复现: 引用 projects/problems/merge-two-sorted-lists/solvers/valkyrie/solution.v
# corpusDefect: #14 含 0（题面要求 ≥1），期望丢弃该位而 TypeScript 参照保留 0；#48 含字符串元素 "112233445566778900" 且数值超过 10^5，保持 blocked
