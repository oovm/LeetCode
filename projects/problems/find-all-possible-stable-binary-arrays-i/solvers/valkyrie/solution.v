# 阻塞：std.collection 数组分配与索引
# 题内触发点：双键组 DP 表 `dp[zero][one]` 带 limit 约束 —— 稳定二进数组计数需要二维定长表。
# 期望语义：定长表分配与下标读写；实际同「数组分配与索引」缺口（首记于 get-maximum-in-generated-array）。
# 理想算法：按末尾连同色段长转移的三维 DP 滚动（zero/one/run），模 10^9+7。时间 O(zero·one·limit)。
