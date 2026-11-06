namespace leetcode.make_array_zero_by_subtracting_equal_amounts;

using std.collection;

# 最少操作次数等于不同正数的个数。
[export(case: "camelCase")]
micro minimumOperations(nums: ArrayList<i64>) -> i64 {
    let mut seen: HashMap<i64, i64> = HashMap::new(0)
    let mut total: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        if value > 0 && !seen.contains_key(value) {
            seen.insert(value, 1)
            total = total + 1
        }
        index = index + 1
    }
    return total
}

class Solution {
    micro minimumOperations(self, nums: ArrayList<i64>): i64 {
        return minimumOperations(nums)
    }
}
