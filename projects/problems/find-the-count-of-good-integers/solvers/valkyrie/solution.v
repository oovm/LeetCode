# 阻塞：std.collection 哈希表 / 集合（去重键）
# 题内触发点：`seen.insert(digit_signature)` —— 枚举回文半段后按数字多重集签名去重，签名本身还需十位计数表承载。
# 期望语义：集合按键查重 + 定长计数表下标读写。实际：std 集合/哈希调用链报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现：引用 can-i-win 的哈希表首记复现（计数表同阻于 get-maximum-in-generated-array 的数组首记复现）。
# 理想算法：枚举半段构造回文并检验 k 整除，对数字多重集去重后按多重排列计数（扣前导零），时间 O(10^(n/2)·n) 空间 O(10^(n/2))。
