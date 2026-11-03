# 阻塞：std.collection 数组分配与索引
# 题内触发点：9 宫格访问表 `visited` 与跨跳表 `skip[9][9]` —— 回溯需要可按下标读写的定长表。
# 期望语义：定长二维/一维表读写；实际同「数组分配与索引」缺口。
# 最小复现：引用 get-maximum-in-generated-array 的 inline 复现（同一能力）。
# 理想算法：回溯枚举长度 m..n 的所有合法图案（跨点须经已访问点）， visited/skip 定长表驱动。时间 O(9!) 空间 O(1) 表。
