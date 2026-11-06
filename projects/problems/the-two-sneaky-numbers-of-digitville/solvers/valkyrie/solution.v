namespace leetcode.the_two_sneaky_numbers_of_digitville;

using std.collection;

# 按首次出现顺序记录数值，输出计数恰为 2 的两个数。
[export(case: "camelCase")]
micro getSneakyNumbers(nums: ArrayList<i64>) -> ArrayList<i64> {
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut order: ArrayList<i64> = ArrayList::new(nums.length())
    let mut index: usize = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        if counts.contains_key(value) {
            counts.insert(value, counts.get(value).unwrap() + 1)
        } else {
            counts.insert(value, 1)
            order.push(value)
        }
        index = index + 1
    }
    let mut result: ArrayList<i64> = ArrayList::new(2)
    index = 0
    while index < order.length() {
        let value: i64 = order⁅index⁆
        if counts.get(value).unwrap() == 2 {
            result.push(value)
        }
        index = index + 1
    }
    return result
}

class Solution {
    micro getSneakyNumbers(self, nums: ArrayList<i64>): ArrayList<i64> {
        return getSneakyNumbers(nums)
    }
}
