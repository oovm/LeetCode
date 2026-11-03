# 阻塞：std.collection 数组分配与索引
# 题内触发点：逆序对计数 DP 表 `dp[i][j]` —— k 逆序对计数需要二维定长表。
# 期望语义：定长表分配与下标读写；实际同「数组分配与索引」缺口（首记于 get-maximum-in-generated-array）。
# 理想算法：dp[i][j] = dp[i-1][j] + dp[i][j-1] - dp[i-1][j-i]，模 10^9+7。时间 O(n·k) 空间 O(k)。
