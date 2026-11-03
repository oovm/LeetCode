# 阻塞：std.collection 哈希表 / 备忘表
# 题内触发点：`memo⁅n⁆ = ...` —— 递归 f(n)=1+min(n%2+f(n/2), n%3+f(n/3)) 需要按已见 n 缓存避免指数分叉。
# 期望语义：哈希表按键存取。实际：std 哈希表调用链报 unresolved call `<computed>`。
# 最小复现：引用 can-i-win 的本能力首记复现。
# 理想算法：带备忘的递归，每层只保留 n/2、n/3 两条支路，时间 O(log² n) 空间 O(log n)。
