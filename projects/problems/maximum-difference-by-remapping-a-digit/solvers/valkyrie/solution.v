namespace leetcode.maximum_difference_by_remapping_a_digit;

# 数位掩码：Σ 10^p，遍历所有等于 digit 的数位位置。
micro digit_mask(num: i64, digit: i64) -> i64 {
    let mut mask: i64 = 0
    let mut place: i64 = 1
    let mut rest: i64 = num
    while rest > 0 {
        if rest % 10 == digit {
            mask = mask + place
        }
        rest = rest / 10
        place = place * 10
    }
    return mask
}

# 最高位的位权（10^{len-1}）。
micro highest_place(num: i64) -> i64 {
    let mut place: i64 = 1
    while place * 10 <= num {
        place = place * 10
    }
    return place
}

[export(case: "camelCase")]
micro min_max_difference(num: i64) -> i64 {
    # 最大：最高位起第一个非 9 数字整体 remap 到 9。
    let mut target: i64 = -1
    let mut place: i64 = highest_place(num)
    while place >= 1 {
        let d: i64 = (num / place) % 10
        if target < 0 && d != 9 {
            target = d
        }
        place = place / 10
    }
    let mut max_value: i64 = num
    if target >= 0 {
        max_value = num + (9 - target) * digit_mask(num, target)
    }
    # 最小：最高位数字整体 remap 到 0（允许前导零）。
    let lead: i64 = num / highest_place(num)
    let min_value: i64 = num - lead * digit_mask(num, lead)
    return max_value - min_value
}

class Solution {
    micro minMaxDifference(self, num: i64): i64 {
        return min_max_difference(num)
    }
}
