# 阻塞：std.collection 数组分配与索引
# 题内触发点：二维 minimax DP 表 `dp[l][r]`（区间猜数代价）—— 猜数字 II 的理想写法是区间 DP。
# 期望语义：二维定长表分配与下标读写；实际同「数组分配与索引」缺口（首记于 get-maximum-in-generated-array）。
# 理想算法：dp[l][r] = min_{x∈[l,r]} x + max(dp[l][x-1], dp[x+1][r])，区间 DP。时间 O(n³) 空间 O(n²)。
