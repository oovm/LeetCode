namespace leetcode.house_robber_iv;

using std.collection;

# 二分答案：最小可接受金额 `cap` 单调可行。
# 贪心扫描：金额不超过 `cap` 就取，并跳过相邻下一间。
micro enough(nums: ArrayList<i64>, cap: i64, k: i64) -> bool {
    let mut taken: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        if nums⁅index⁆ <= cap {
            taken = taken + 1
            index = index + 2
        } else {
            index = index + 1
        }
    }
    return taken >= k
}

[export(case: "camelCase")]
micro minCapability(nums: ArrayList<i64>, k: i64) -> i64 {
    let mut low: i64 = nums⁅0⁆
    let mut high: i64 = nums⁅0⁆
    loop value in nums {
        if value < low {
            low = value
        }
        if value > high {
            high = value
        }
    }
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if enough(nums, mid, k) {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return low
}

class Solution {
    micro minCapability(self, nums: ArrayList<i64>, k: i64): i64 {
        return minCapability(nums, k)
    }
}
