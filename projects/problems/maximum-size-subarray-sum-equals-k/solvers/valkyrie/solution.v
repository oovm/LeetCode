namespace leetcode.maximum_size_subarray_sum_equals_k;

using std.collection;

# 前缀和 + 首次下标表：`sum - k` 曾出现过则取长度差；只记首次出现以保最长。
[export(case: "camelCase")]
micro maxSubArrayLen(nums: ArrayList<i64>, k: i64) -> i64 {
    let mut first_at: HashMap<i64, i64> = HashMap::new(0)
    first_at.insert(0, -1)
    let mut sum: i64 = 0
    let mut best: i64 = 0
    let mut i: usize = 0
    while i < nums.length() {
        sum = sum + nums⁅i⁆
        if first_at.contains_key(sum - k) {
            let length: i64 = i as i64 - first_at.get(sum - k).unwrap()
            if length > best {
                best = length
            }
        }
        if !first_at.contains_key(sum) {
            first_at.insert(sum, i as i64)
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro maxSubArrayLen(self, nums: ArrayList<i64>, k: i64): i64 {
        return maxSubArrayLen(nums, k)
    }
}
