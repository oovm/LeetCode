# 阻塞：浮点返回值合同（`f64` 原始常量与 `Nominal(f64)` 不兼容）
# 题内触发点：`nthPersonGetsNthSeat` 需要返回概率 `1.0` / `0.5`。
# 期望语义：`-> f64` 直接返回浮点字面量。实际：`return` value type `f64` is incompatible with the function return type `Nominal(ItemId(3))`。
# 最小复现（本能力首记）：`micro half() -> f64 { return 0.5 }`，期望返回 0.5，实际同上。
# 理想算法：n == 1 返回 1，否则 0.5，时间 O(1) 空间 O(1)。
