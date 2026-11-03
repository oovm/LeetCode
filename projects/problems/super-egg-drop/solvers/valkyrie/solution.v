# 阻塞：std.collection 数组分配与索引
# 题内触发点：鸡蛋 DP 表 `dp[k][m]`（鸡蛋数 × 剩余尝试）—— 超级鸡蛋掉落的最优解是二维 DP。
# 期望语义：定长表分配与下标读写；实际同「数组分配与索引」缺口（首记于 get-maximum-in-generated-array）。
# 理想算法：dp[m][k] = dp[m-1][k-1] + dp[m-1][k] + 1，最小 m 使 ≥ n。时间 O(k log n) 空间 O(k)。
