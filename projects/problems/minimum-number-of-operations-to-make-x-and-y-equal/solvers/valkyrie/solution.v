# 阻塞：std.collection 队列 / 集合（BFS 访问结构）
# 题内触发点：x→y 变换（-1、/2、/5、/7）的最短操作数理想写法是 BFS/备忘，需要队列与去重集合。
# 期望语义：队列与集合；实际同 minimum-knight-moves 记录的 std.collection 解析缺口。
# 理想算法：从 y 反向（+1、×2/×5/×7 仅当整除）BFS 到 x，层数即答案。时间 O(状态数)。
