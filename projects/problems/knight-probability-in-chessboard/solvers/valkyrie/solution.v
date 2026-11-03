# 阻塞：f64 浮点语义 + std.collection 数组分配与索引
# 题内触发点：`dp⁅r⁆⁅c⁆ = Σ dp'⁅r+dr⁆⁅c+dc⁆ / 8` —— 棋盘概率 DP 需要 f64 运算与二维表。
# 期望语义：f64 四则/返回 + 运行期二维表。实际：f64 通道未实跑验证，数组调用链 unresolved call `<computed>`。
# 最小复现：f64 引用 powx-n 的本能力首记复现；数组引用 get-maximum-in-generated-array 的首记复现。
# 理想算法：k 轮棋盘转移概率 DP，时间 O(k·n²) 空间 O(n²)。
