namespace leetcode.increasing_triplet_subsequence;

using std.collection;

# 贪心维护最小与次小：出现大于次小者即三元组存在。O(n) 时间 O(1) 空间。
[export(case: "camelCase")]
micro increasingTriplet(nums: [i64]) -> bool {
    let mut first: i64 = 0
    let mut second: i64 = 0
    let mut has_first: bool = false
    let mut has_second: bool = false
    loop value in nums {
        if has_first && value <= first {
            first = value
        } else if has_second && value <= second {
            second = value
        } else if !has_first {
            first = value
            has_first = true
        } else if !has_second {
            second = value
            has_second = true
        } else {
            return true
        }
    }
    return false
}

class Solution {
    micro increasingTriplet(self, nums: [i64]): bool {
        return increasingTriplet(nums)
    }
}
