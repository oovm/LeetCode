# 阻塞：std.collection 数组分配与索引
# 题内触发点：三维 DP 表 `dp[move][i][j]` —— 按剩余步数滚动的网格计数需要定长表读写。
# 期望语义：定长表分配与下标读写；实际同「数组分配与索引」缺口（首记于 get-maximum-in-generated-array）。
# 理想算法：dp[i][j] 滚动两轮（当前步/上一步），越界计入答案，模 10^9+7。时间 O(maxMove·m·n) 空间 O(m·n)。
