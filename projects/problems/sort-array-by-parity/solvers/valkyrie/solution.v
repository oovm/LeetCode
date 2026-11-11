namespace leetcode.sort_array_by_parity;

# 双指针：左指针停在奇数、右指针停在偶数，交换后两侧各自推进。
# 定长载体写侧：每次交换都经 `⁅ ⁆=` 落回原容器，O(n) 时间 / O(1) 额外空间。
[export(case: "camelCase")]
micro sort_array_by_parity(mut nums: [i64]) -> [i64] {
    let count: usize = nums.length()
    if count == 0 {
        return nums
    }
    let mut left: usize = 0
    let mut right: usize = count - 1
    while left < right {
        if nums⁅left⁆ % 2 == 0 {
            left = left + 1
        } else {
            if nums⁅right⁆ % 2 != 0 {
                right = right - 1
            } else {
                let tmp: i64 = nums⁅left⁆
                nums⁅left⁆ = nums⁅right⁆
                nums⁅right⁆ = tmp
                left = left + 1
                right = right - 1
            }
        }
    }
    return nums
}

class Solution {
    micro sortArrayByParity(mut self, nums: [i64]): [i64] {
        return sort_array_by_parity(nums)
    }
}
