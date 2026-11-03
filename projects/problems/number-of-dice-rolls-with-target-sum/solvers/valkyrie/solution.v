# 阻塞：std.collection 数组分配与索引
# 题内触发点：`dp[i][s]` 骰子 DP 表（骰子数 × 目标和）—— 二维计数 DP 需要定长表读写。
# 期望语义：定长表分配与下标读写；实际同「数组分配与索引」缺口（首记于 get-maximum-in-generated-array）。
# 理想算法：dp[i][s] = Σ_{f=1..k} dp[i-1][s-f]，滚动两轮，模 10^9+7。时间 O(n·target·k) 空间 O(target)。
