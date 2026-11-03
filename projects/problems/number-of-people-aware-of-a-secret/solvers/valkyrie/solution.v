# 阻塞：std.collection 数组分配与索引
# 题内触发点：按天的传播表 `share[i]`（delay/forget 滑窗差分）—— 秘密传播的理想写法是按天 DP 表。
# 期望语义：定长表分配与下标读写；实际同「数组分配与索引」缺口（首记于 get-maximum-in-generated-array）。
# 理想算法：share[i] 差分累计，remember 窗口求和，模 10^9+7。时间 O(n) 空间 O(n)。
