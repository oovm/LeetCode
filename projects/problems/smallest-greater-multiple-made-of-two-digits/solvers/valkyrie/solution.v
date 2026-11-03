# 阻塞：std.collection 队列 / 集合（BFS 访问结构）
# 题内触发点：余数 BFS 的 front 队列与 seen 集合 —— 「仅由两种数字构成且为 k 的倍数的最小 >k 整数」的理想写法是余数 BFS。
# 期望语义：队列与集合；实际同 minimum-knight-moves 记录的 std.collection 解析缺口。
# 理想算法：从 digit1/digit2 出发按余数 BFS（值 × 10 + d），首个 > k 且余 0 者。时间 O(k) 空间 O(k)。
