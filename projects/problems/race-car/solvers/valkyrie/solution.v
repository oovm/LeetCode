# 阻塞：std.collection 队列 / 集合（BFS 访问结构）
# 题内触发点：赛车档位 A/R 的最短指令序列理想写法是 BFS（或等价的 heap 化 DP），需要队列/集合。
# 期望语义：队列与集合；实际同 minimum-knight-moves 记录的 std.collection 解析缺口。
# 理想算法：BFS 状态 (位置, 速度) 按指令层数扩张。时间 O(target log target) 空间同阶。
