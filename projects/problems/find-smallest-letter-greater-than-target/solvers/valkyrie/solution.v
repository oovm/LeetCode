namespace leetcode.find_smallest_letter_greater_than_target;

# 上界二分：找第一个严格大于 target 的位置，越界则回绕到 0。
# 题内触发点: G13 / G15 —— 理想写法直接对 `utf8` 写 `<=`，
# 这要求字典序比较合同（`Comparable` 或 `Utf8Text.compare`）；std 目前只有 `equals` / `not_equals`，
# 因此本题按理想写法保留比较算子，不在题内手写逐字节 compare。
[export(case: "camelCase")]
micro next_greatest_letter(letters: [utf8], target: utf8) -> utf8 {
    let count: usize = letters.length()
    let mut low: i64 = 0
    let mut high: i64 = count as i64
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if letters⁅mid as usize⁆ <= target {
            low = mid + 1
        } else {
            high = mid
        }
    }
    if low == count as i64 {
        return letters⁅0⁆
    }
    return letters⁅low as usize⁆
}

class Solution {
    micro nextGreatestLetter(self, letters: [utf8], target: utf8): utf8 {
        return next_greatest_letter(letters, target)
    }
}
