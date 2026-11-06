namespace leetcode.min_max_game;

using std.collection;

# 反复对半归约：偶数下标取相邻两数较小值，奇数下标取较大值。
[export(case: "camelCase")]
micro minMaxGame(nums: ArrayList<i64>) -> i64 {
    let mut current: ArrayList<i64> = ArrayList::new(nums.length())
    let mut index: usize = 0
    while index < nums.length() {
        current.push(nums⁅index⁆)
        index = index + 1
    }
    let mut length: usize = current.length()
    while length > 1 {
        length = length / 2
        let mut position: usize = 0
        while position < length {
            let left: i64 = current⁅2 * position⁆
            let right: i64 = current⁅2 * position + 1⁆
            if position % 2 == 0 {
                if left < right {
                    current⁅position⁆ = left
                } else {
                    current⁅position⁆ = right
                }
            } else {
                if left > right {
                    current⁅position⁆ = left
                } else {
                    current⁅position⁆ = right
                }
            }
            position = position + 1
        }
    }
    return current⁅0⁆
}

class Solution {
    micro minMaxGame(self, nums: ArrayList<i64>): i64 {
        return minMaxGame(nums)
    }
}
