namespace leetcode.largest_subarray_length_k;

using std.collection;

# 长度为 k 的子数组中，字典序由首元素决定，取可作起点的最大值位置。
[export(case: "camelCase")]
micro largestSubarray(nums: ArrayList<i64>, k: i64) -> ArrayList<i64> {
    let window: usize = k as usize
    let limit: usize = nums.length() - window
    let mut start: usize = 0
    let mut position: usize = 1
    while position <= limit {
        if nums⁅position⁆ > nums⁅start⁆ {
            start = position
        }
        position = position + 1
    }

    let mut answer: ArrayList<i64> = ArrayList::new(window)
    let mut offset: usize = 0
    while offset < window {
        answer.push(nums⁅start + offset⁆)
        offset = offset + 1
    }
    return answer
}

class Solution {
    micro largestSubarray(self, nums: ArrayList<i64>, k: i64): ArrayList<i64> {
        return largestSubarray(nums, k)
    }
}
