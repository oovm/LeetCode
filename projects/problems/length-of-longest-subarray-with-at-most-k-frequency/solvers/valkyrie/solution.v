namespace leetcode.length_of_longest_subarray_with_at_most_k_frequency;

using std.collection;

# 滑窗内任一值的出现次数 ≤ k：扩到右端后，只可能右端值的计数超标，从左端收缩到合规。
[export(case: "camelCase")]
micro maxSubarrayLength(nums: [i64], k: i64) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(nums.length())
    let mut left: usize = 0
    let mut best: i64 = 0
    let mut right: usize = 0
    while right < nums.length() {
        let value: i64 = nums⁅right⁆
        let mut next: i64 = 1
        if counts.contains_key(value) {
            next = counts.get(value).unwrap() + 1
        }
        counts.insert(value, next)

        while counts.get(value).unwrap() > k {
            let oldest: i64 = nums⁅left⁆
            counts.insert(oldest, counts.get(oldest).unwrap() - 1)
            left = left + 1
        }

        let window: i64 = right as i64 - left as i64 + 1
        if window > best {
            best = window
        }
        right = right + 1
    }
    return best
}

class Solution {
    micro maxSubarrayLength(self, nums: [i64], k: i64): i64 {
        return maxSubarrayLength(nums, k)
    }
}
