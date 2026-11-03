# 阻塞：std.collection 数组分配与索引
# 题内触发点：`dp⁅pos⁆⁅sum⁆⁅prod_mod⁆` —— 枚举目标和 s 后按 (位序,  digit 和, digit 积 mod s) 三维 DP 计数。
# 期望语义：运行期长度多维表分配与下标读写。实际：`⁅ ⁆`/`push` 链路在 std 容器内部报 unresolved call `<computed>`，四 lane 同阻。
# 最小复现：引用 get-maximum-in-generated-array 的本能力首记复现。
# 理想算法：f(r)-f(l-1) 两段，对每个候选 digit 和 s≤81 做积同余 s 的数位 DP，时间 O(位数·81²·10) 空间 O(位数·81²)。
