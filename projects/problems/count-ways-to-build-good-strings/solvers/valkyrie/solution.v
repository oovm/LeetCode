# 阻塞：std.collection 数组分配与索引
# 题内触发点：按长度的构造计数表 `dp[len]`（zero/one 追加转移）—— 好串计数的理想写法是长度 DP 表。
# 期望语义：DP 表分配与下标读写；实际同「数组分配与索引」缺口（首记于 get-maximum-in-generated-array）。
# 理想算法：dp[i] = dp[i-zero] + dp[i-one]，Σ_{i=low..high}，模 10^9+7。时间 O(high) 空间 O(high)。
