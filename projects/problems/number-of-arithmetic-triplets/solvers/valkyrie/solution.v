namespace leetcode.number_of_arithmetic_triplets;

using std.collection;

# 哈希集合记录全部取值，再逐项检查 x + diff 与 x + 2 * diff 是否都在集合内。
[export(case: "camelCase")]
micro arithmeticTriplets(nums: ArrayList<i64>, diff: i64) -> i64 {
    let mut seen: HashMap<i64, i64> = HashMap::new(0)
    let mut index: usize = 0
    while index < nums.length() {
        seen.insert(nums⁅index⁆, 1)
        index = index + 1
    }

    let mut total: i64 = 0
    index = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        let middle: i64 = value + diff
        let last: i64 = value + diff + diff
        if seen.contains_key(middle) {
            if seen.contains_key(last) {
                total = total + 1
            }
        }
        index = index + 1
    }
    return total
}

class Solution {
    micro arithmeticTriplets(self, nums: ArrayList<i64>, diff: i64): i64 {
        return arithmeticTriplets(nums, diff)
    }
}
