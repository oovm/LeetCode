# 阻塞：std.collection 数组分配与索引
# 题内触发点：按串长的 0/1 组 DP 表（minLength..maxLength × 组约束）—— 好二进串计数需要长度 DP 表。
# 期望语义：DP 表分配与下标读写；实际同「数组分配与索引」缺口（首记于 get-maximum-in-generated-array）。
# 理想算法：dp[i] = dp[i-zeroGroup] + dp[i-oneGroup]（组内齐字符），Σ_{minLength..maxLength}，模 10^9+7。
