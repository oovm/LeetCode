# 阻塞：std.collection 哈希表 / 备忘表
# 题内触发点：`leastOps(target)` 的备忘映射 —— 最少算符表达式需要按 target 记忆化递归。
# 期望语义：HashMap::new + insert/get；实际同 can-i-win 记录的 std.collection 解析缺口。
# 最小复现：引用 can-i-win 的 inline 复现（同一能力族）。
# 理想算法：记忆化搜索：target 写成 x 的多项式余项，正余项/负补取优。时间 O(log target)。
