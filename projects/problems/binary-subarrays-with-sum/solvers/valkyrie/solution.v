namespace leetcode.binary_subarrays_with_sum;

using std.collection;

# 前缀和 + 频次表：每个前缀 `prefix` 累加此前出现过的 `prefix - goal` 次数。
[export(case: "camelCase")]
micro numSubarraysWithSum(nums: ArrayList<i64>, goal: i64) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(nums.length() + 1)
    counts.insert(0, 1)

    let mut prefix: i64 = 0
    let mut total: i64 = 0
    loop value in nums {
        prefix = prefix + value

        let target: i64 = prefix - goal
        if counts.contains_key(target) {
            total = total + counts.get(target).unwrap()
        }

        let mut next: i64 = 1
        if counts.contains_key(prefix) {
            next = counts.get(prefix).unwrap() + 1
        }
        counts.insert(prefix, next)
    }
    return total
}

class Solution {
    micro numSubarraysWithSum(self, nums: ArrayList<i64>, goal: i64): i64 {
        return numSubarraysWithSum(nums, goal)
    }
}
