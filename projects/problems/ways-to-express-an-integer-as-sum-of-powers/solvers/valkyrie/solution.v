# 阻塞：std.collection 数组分配与索引
# 题内触发点：幂次子集计数表 `dp[s]`（i^x 面值的 0/1 背包）—— 次幂和计数的理想写法是 DP 表。
# 期望语义：DP 表分配与下标读写；实际同「数组分配与索引」缺口（首记于 get-maximum-in-generated-array）。
# 理想算法：对每个底数 i（i^x ≤ n）做 0/1 背包 dp[s] += dp[s - i^x]，模 10^9+7。时间 O(n·n^{1/x}) 空间 O(n)。
