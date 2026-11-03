# 阻塞：std.collection 数组分配与索引
# 题内触发点：`let mut dp: [i64] = [0; n + 1]` 配合 `dp⁅i⁆ = ...` 三指针填表 —— 丑数 DP 表是理想写法本身。
# 期望语义：DP 表分配与下标读写；实际同「数组分配与索引」缺口。
# 最小复现：引用 get-maximum-in-generated-array 的 inline 复现（同一能力）。
# 理想算法：dp[0]=1，p2/p3/p5 三指针，dp[i]=min(dp[p2]*2, dp[p3]*3, dp[p5]*5)，推进相等指针。时间 O(n) 空间 O(n)。
