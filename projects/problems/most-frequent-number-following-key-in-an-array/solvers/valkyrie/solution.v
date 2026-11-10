namespace leetcode.most_frequent_number_following_key_in_an_array;

using std.collection;

# 值域 1..1000 桶计数 key 后继；升序扫桶、严格大于才更新，并列自然取最小值。
[export(case: "camelCase")]
micro mostFrequent(nums: ArrayList<i64>, key: i64) -> i64 {
    let mut freq: ArrayList<i64> = ArrayList::new(1001)
    let mut slot: usize = 0
    while slot <= 1000 {
        freq.push(0)
        slot = slot + 1
    }
    let mut i: usize = 0
    while i + 1 < nums.length() {
        if nums⁅i⁆ == key {
            freq⁅nums⁅i + 1⁆ as usize⁆ = freq⁅nums⁅i + 1⁆ as usize⁆ + 1
        }
        i = i + 1
    }
    let mut best: i64 = 0
    let mut best_count: i64 = -1
    let mut value: usize = 1
    while value <= 1000 {
        if freq⁅value⁆ > best_count {
            best_count = freq⁅value⁆
            best = value as i64
        }
        value = value + 1
    }
    return best
}

class Solution {
    micro mostFrequent(self, nums: ArrayList<i64>, key: i64): i64 {
        return mostFrequent(nums, key)
    }
}
