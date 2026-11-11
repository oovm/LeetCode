namespace leetcode.find_the_duplicate_number;

micro next_index(nums: [i64], index: i64) -> i64 {
    return nums⁅index as usize⁆
}

[export(case: "camelCase")]
micro find_duplicate(nums: [i64]) -> i64 {
    let mut slow: i64 = nums⁅0⁆
    let mut fast: i64 = nums⁅0⁆
    slow = next_index(nums, slow)
    fast = next_index(nums, next_index(nums, fast))
    while slow != fast {
        slow = next_index(nums, slow)
        fast = next_index(nums, next_index(nums, fast))
    }
    slow = nums⁅0⁆
    while slow != fast {
        slow = next_index(nums, slow)
        fast = next_index(nums, fast)
    }
    return slow
}

class Solution {
    micro findDuplicate(self, nums: [i64]): i64 {
        return find_duplicate(nums)
    }
}
