namespace leetcode.max_number_of_k_sum_pairs;

# 升序 + 双指针：两端和等于 k 就成对移除，和小则左进，和大则右退。
[export(case: "camelCase")]
micro maxOperations(nums: ArrayList<i64>, k: i64) -> i64 {
    let mut ordered: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        ordered.push(value)
    }
    sort(ordered)

    let mut left: i64 = 0
    let mut right: i64 = ordered.length() as i64 - 1
    let mut pairs: i64 = 0
    while left < right {
        let sum: i64 = ordered⁅left as usize⁆ + ordered⁅right as usize⁆
        if sum == k {
            pairs = pairs + 1
            left = left + 1
            right = right - 1
        }
        else {
            if sum < k {
                left = left + 1
            }
            else {
                right = right - 1
            }
        }
    }
    return pairs
}

class Solution {
    micro maxOperations(self, nums: ArrayList<i64>, k: i64): i64 {
        return maxOperations(nums, k)
    }
}
