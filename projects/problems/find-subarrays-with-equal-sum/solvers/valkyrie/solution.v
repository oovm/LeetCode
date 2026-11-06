namespace leetcode.find_subarrays_with_equal_sum;

using std.collection;

# 相邻两数之和放进集合，若重复出现即存在等和子数组。
[export(case: "camelCase")]
micro findSubarrays(nums: ArrayList<i64>) -> bool {
    let mut seen: HashSet<i64> = HashSet::new()
    let mut index: usize = 0
    while index + 1 < nums.length() {
        let total: i64 = nums⁅index⁆ + nums⁅index + 1⁆
        if seen.contains(total) {
            return true
        }
        seen.insert(total)
        index = index + 1
    }
    return false
}

class Solution {
    micro findSubarrays(self, nums: ArrayList<i64>): bool {
        return findSubarrays(nums)
    }
}
