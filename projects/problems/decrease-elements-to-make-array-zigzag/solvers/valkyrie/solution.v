namespace leetcode.decrease_elements_to_make_array_zigzag;

using std.collection;

# 两种峰谷起点各扫一遍：谷位只需压到「两侧较小值减一」，O(n)。
micro cost(nums: [i64], start: i64) -> i64 {
    let count: i64 = nums.length() as i64
    let mut total: i64 = 0
    let mut i: i64 = start
    while i < count {
        let value: i64 = nums⁅i as usize⁆
        let mut limit: i64 = 1000000000
        if i > 0 && nums⁅(i - 1) as usize⁆ < limit {
            limit = nums⁅(i - 1) as usize⁆
        }
        if i + 1 < count && nums⁅(i + 1) as usize⁆ < limit {
            limit = nums⁅(i + 1) as usize⁆
        }
        if value > limit - 1 {
            total = total + value - (limit - 1)
        }
        i = i + 2
    }
    return total
}

[export(case: "camelCase")]
micro movesToMakeZigzag(nums: [i64]) -> i64 {
    let even: i64 = cost(nums, 0)
    let odd: i64 = cost(nums, 1)
    if even < odd {
        return even
    }
    return odd
}

class Solution {
    micro movesToMakeZigzag(self, nums: [i64]): i64 {
        return movesToMakeZigzag(nums)
    }
}
