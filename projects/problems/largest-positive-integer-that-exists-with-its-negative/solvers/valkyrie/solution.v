namespace leetcode.largest_positive_integer_that_exists_with_its_negative;

using std.collection;

# 找最大的 k，使 k 与 -k 都出现；不存在返回 -1。
[export(case: "camelCase")]
micro findMaxK(nums: [i64]) -> i64 {
    let mut seen: HashMap<i64, i64> = HashMap::new(0)
    let mut index: usize = 0
    while index < nums.length() {
        seen.insert(nums⁅index⁆, 1)
        index = index + 1
    }
    let mut best: i64 = -1
    index = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        if value > 0 && seen.contains_key(-value) && value > best {
            best = value
        }
        index = index + 1
    }
    return best
}

class Solution {
    micro findMaxK(self, nums: [i64]): i64 {
        return findMaxK(nums)
    }
}
