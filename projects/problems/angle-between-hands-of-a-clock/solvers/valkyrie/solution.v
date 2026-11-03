# 阻塞：浮点返回值合同（`f64` 原始常量与 `Nominal(f64)` 不兼容）
# 题内触发点：`angleClock` 需要浮点角度差 `30*(hour%12) - 5.5*minutes` 并返回最小值。
# 期望语义：`-> f64` 接受浮点算术与字面量。实际：`return` value type `f64` is incompatible with the function return type `Nominal(ItemId(3))`。
# 最小复现（本能力首记）：`micro half() -> f64 { return 0.5 }`，期望返回 0.5，实际同上。
# 理想算法：hourAngle=30*(hour%12)，minuteAngle=5.5*minutes，答案=min(|diff|, 360-|diff|)，时间 O(1) 空间 O(1)。
