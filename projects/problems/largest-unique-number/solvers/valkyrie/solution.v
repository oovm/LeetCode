namespace leetcode.largest_unique_number;

using std.collection;

# 先计频，再在只出现一次的数值中取最大。
[export(case: "camelCase")]
micro largestUniqueNumber(nums: [i64]) -> i64 {
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
    let mut answer: i64 = -1
    let mut found: bool = false
    index = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        if counts.get(value).unwrap() == 1 {
            if !found || value > answer {
                answer = value
                found = true
            }
        }
        index = index + 1
    }
    return answer
}

class Solution {
    micro largestUniqueNumber(self, nums: [i64]): i64 {
        return largestUniqueNumber(nums)
    }
}
