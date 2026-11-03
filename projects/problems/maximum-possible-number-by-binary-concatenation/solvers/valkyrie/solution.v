namespace leetcode.maximum_possible_number_by_binary_concatenation;

micro bit_length(value: i64) -> i64 {
    let mut v: i64 = value
    let mut len: i64 = 0
    while v > 0 {
        v = v >> 1
        len = len + 1
    }
    return len
}

# 全排列比较拼接后的二进制数值，元素个数最多 4 个。
micro best_order(nums: ArrayList<i64>, mut used: ArrayList<bool>, current: i64, depth: i64, limit: i64, mut best: ArrayList<i64>) -> i64 {
    if depth == limit {
        if current > best⁅0⁆.unwrap() {
            best⁅0⁆ = current
        }
        return best⁅0⁆.unwrap()
    }
    let mut i: usize = 0
    while i < nums.length() {
        if !used⁅i⁆.unwrap() {
            let value: i64 = nums⁅i⁆.unwrap()
            used⁅i⁆ = true
            let shifted: i64 = (current << bit_length(value)) | value
            best_order(nums, used, shifted, depth + 1, limit, best)
            used⁅i⁆ = false
        }
        i = i + 1
    }
    return best⁅0⁆.unwrap()
}

[export(case: "camelCase")]
micro max_good_number(nums: ArrayList<i64>) -> i64 {
    let mut used: ArrayList<bool> = ArrayList::new(nums.length())
    let mut i: usize = 0
    while i < nums.length() {
        used.push(false)
        i = i + 1
    }
    let mut best: ArrayList<i64> = ArrayList::new(1)
    best.push(0)
    return best_order(nums, used, 0, 0, nums.length() as i64, best)
}

class Solution {
    micro maxGoodNumber(self, nums: ArrayList<i64>): i64 {
        return max_good_number(nums)
    }
}
