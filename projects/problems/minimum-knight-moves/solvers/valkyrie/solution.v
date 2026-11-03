# 阻塞：std.collection 队列 / 集合（BFS 访问结构）
# 题内触发点：双向 BFS 的 front 队列与 visited 集合 —— 骑士最短路的理想写法是 BFS，需要队列与去重集合。
# 期望语义：Deque push/pop 与 HashSet insert/contains；实际：std.collection 内部调用报 unresolved call `<computed>`（`source/_.v:7:1`），四 lane 同阻。
# 最小复现：引用 can-i-win 的 inline 复现（同一 std.collection 解析缺口族）。
# 理想算法：双向 BFS，八方向对称折到第一象限，逐层扩张。时间 O(|x|·|y|) 空间同阶。
