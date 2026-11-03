# 阻塞：std.collection 数组分配与索引
# 题内触发点：`let mut arr: [i64] = [0; n + 1]` 配合 `arr⁅i⁆ = arr⁅i / 2⁆ + ...` —— 理想写法需要按 n + 1 分配定长表并按下标读写。
# 期望语义：运行期长度数组分配与下标读写。实际：`⁅ ⁆`/`push` 链路在 std 容器实现内部报 unresolved call `<computed>`（`source/_.v:7:1`），四 lane 同阻；运行期长度分配的作者语法在 intrinsic 清退后未定。
# 最小复现（本能力首记）：`micro f(n: i64) -> i64 { let mut a: [i64] = [0; n] a⁅0⁆ = 1 return a⁅0⁆ }`，期望编译并返回 1，实际 unresolved call `<computed>`。
# 理想算法：arr[0]=0、arr[1]=1，偶数 i 取 arr[i/2]、奇数 i 取 arr[i/2]+arr[i/2+1]，扫出最大值。时间 O(n) 空间 O(n)。
