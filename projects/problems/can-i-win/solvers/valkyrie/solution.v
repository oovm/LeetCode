# 阻塞：std.collection 哈希表 / 备忘表
# 题内触发点：`let memo: HashMap<i64, bool> = ...` —— 极大极小博弈的位掩码备忘需要键值容器（或 2^20 备忘表，同落数组分配缺口）。
# 期望语义：HashMap::new + insert/get；实际：HashMap 内部调用在 std 容器实现内报 unresolved call `<computed>`（`source/_.v:7:1`），四 lane 同阻。
# 最小复现（本能力首记）：`let mut m: HashMap<i64, i64> = HashMap::new(16) m.insert(1, 2) return m.get(1).unwrap()`，期望返回 2，实际 unresolved call `<computed>` in insert。
# 理想算法：位掩码记忆化博弈，used 掩码 + 当前和递归，先手能否使对手必败。时间 O(2^m·m) 空间 O(2^m)。
