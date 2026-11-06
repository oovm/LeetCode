namespace leetcode.sum_of_unique_elements;

using std.collection;

# 先统计频次，再对频次为 1 的元素求和。
[export(case: "camelCase")]
micro sumOfUnique(nums: ArrayList<i64>) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut position: usize = 0
    while position < nums.length() {
        let value: i64 = nums⁅position⁆
        if counts.contains_key(value) {
            counts.insert(value, counts.get(value).unwrap() + 1)
        } else {
            counts.insert(value, 1)
        }
        position = position + 1
    }

    let mut total: i64 = 0
    position = 0
    while position < nums.length() {
        let value: i64 = nums⁅position⁆
        if counts.get(value).unwrap() == 1 {
            total = total + value
        }
        position = position + 1
    }
    return total
}

class Solution {
    micro sumOfUnique(self, nums: ArrayList<i64>): i64 {
        return sumOfUnique(nums)
    }
}
