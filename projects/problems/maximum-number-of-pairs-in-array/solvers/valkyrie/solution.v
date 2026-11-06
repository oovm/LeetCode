namespace leetcode.maximum_number_of_pairs_in_array;

using std.collection;

# 哈希计数，每凑成一对累加；返回 [对数, 剩余个数]。
[export(case: "camelCase")]
micro numberOfPairs(nums: ArrayList<i64>) -> ArrayList<i64> {
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut pairs: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        let mut current: i64 = 1
        if counts.contains_key(value) {
            current = counts.get(value).unwrap() + 1
        }
        counts.insert(value, current)
        if current % 2 == 0 {
            pairs = pairs + 1
        }
        index = index + 1
    }
    let count: i64 = nums.length() as i64
    let mut result: ArrayList<i64> = ArrayList::new(2)
    result.push(pairs)
    result.push(count - 2 * pairs)
    return result
}

class Solution {
    micro numberOfPairs(self, nums: ArrayList<i64>): ArrayList<i64> {
        return numberOfPairs(nums)
    }
}
