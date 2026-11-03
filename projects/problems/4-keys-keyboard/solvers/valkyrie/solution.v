# 阻塞：std.collection 数组分配与索引
# 题内触发点：`dp[i] = max(dp[i-1], dp[i-2] + ...)` 的历史回读 DP 表 —— 4 键键盘的最优解需要任意历史下标。
# 期望语义：DP 表分配与下标读写；实际同「数组分配与索引」缺口（首记于 get-maximum-in-generated-array）。
# 理想算法：dp[i] = max(dp[i-1]+1, max_{j} dp[j]·(i-j-1))（复制粘贴段）。时间 O(n²) 空间 O(n)。
