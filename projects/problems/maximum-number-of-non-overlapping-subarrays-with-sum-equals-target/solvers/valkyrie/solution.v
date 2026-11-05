namespace leetcode.maximum_number_of_non_overlapping_subarrays_with_sum_equals_target;

using std.collection;

# 前缀和相等即区间和为 target。贪心：一旦命中就清空前缀表重开一段，
# 每段最多贡献一个区间，一趟 O(n)。
[export(case: "camelCase")]
micro maxNonOverlapping(nums: ArrayList<i64>, target: i64) -> i64 {
    let mut seen: HashMap<i64, i64> = HashMap::new(0)
    seen.insert(0, 1)
    let mut prefix: i64 = 0
    let mut total: i64 = 0
    let mut i: usize = 0
    while i < nums.length() {
        prefix = prefix + nums⁅i⁆
        let needed: i64 = prefix - target
        if seen.contains_key(needed) {
            total = total + 1
            seen = HashMap::new(0)
            seen.insert(0, 1)
            prefix = 0
        } else {
            seen.insert(prefix, 1)
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro maxNonOverlapping(self, nums: ArrayList<i64>, target: i64): i64 {
        return maxNonOverlapping(nums, target)
    }
}
