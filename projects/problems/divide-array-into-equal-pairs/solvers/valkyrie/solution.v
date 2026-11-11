namespace leetcode.divide_array_into_equal_pairs;

using std.collection;

# 每个数值出现次数为偶数即可两两配对。
[export(case: "camelCase")]
micro divideArray(nums: [i64]) -> bool {
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut index: usize = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        if counts.contains_key(value) {
            counts.insert(value, counts.get(value).unwrap() + 1)
        } else {
            counts.insert(value, 1)
        }
        index = index + 1
    }
    index = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        if counts.get(value).unwrap() % 2 != 0 {
            return false
        }
        index = index + 1
    }
    return true
}

class Solution {
    micro divideArray(self, nums: [i64]) -> bool {
        return divideArray(nums)
    }
}
