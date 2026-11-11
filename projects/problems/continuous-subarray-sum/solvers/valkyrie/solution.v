namespace leetcode.continuous_subarray_sum;

using std.collection;

# 前缀和取模：同一余数两次出现且跨度 >= 2 即存在 k 的倍数子数组。
[export(case: "camelCase")]
micro checkSubarraySum(nums: [i64], k: i64) -> bool {
    let mut firstSeen: HashMap<i64, i64> = HashMap::new(0)
    firstSeen.insert(0, -1)
    let mut sum: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        sum = (sum + nums⁅index⁆) % k
        if firstSeen.contains_key(sum) {
            if index as i64 - firstSeen.get(sum).unwrap() >= 2 {
                return true
            }
        } else {
            firstSeen.insert(sum, index as i64)
        }
        index = index + 1
    }
    return false
}

class Solution {
    micro checkSubarraySum(self, nums: [i64], k: i64): bool {
        return checkSubarraySum(nums, k)
    }
}
