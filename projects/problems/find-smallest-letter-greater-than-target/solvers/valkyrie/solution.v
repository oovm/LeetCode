namespace leetcode.find_smallest_letter_greater_than_target;

# 上界二分：找第一个严格大于 target 的位置，越界则回绕到 0。
# `utf8` 的 `<=` 由 `Utf8Text` 的 `Comparable` 合同派生，直接比较即可。
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
