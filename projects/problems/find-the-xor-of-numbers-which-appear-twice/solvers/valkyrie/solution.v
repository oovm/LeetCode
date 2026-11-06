namespace leetcode.find_the_xor_of_numbers_which_appear_twice;

using std.collection;

# 计频后只对恰好出现两次的值异或一次（处理后把计数清零避免重复异或）。
[export(case: "camelCase")]
micro duplicateNumbersXOR(nums: ArrayList<i64>) -> i64 {
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
    let mut answer: i64 = 0
    index = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        if counts.get(value).unwrap() == 2 {
            answer = bit_xor(answer, value)
            counts.insert(value, 0)
        }
        index = index + 1
    }
    return answer
}

class Solution {
    micro duplicateNumbersXOR(self, nums: ArrayList<i64>): i64 {
        return duplicateNumbersXOR(nums)
    }
}
