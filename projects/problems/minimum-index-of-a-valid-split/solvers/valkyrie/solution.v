namespace leetcode.minimum_index_of_a_valid_split;

using std.collection;

# 先求支配元素（出现次数最多者），再做前缀计数，检查两侧都严格过半。
[export(case: "camelCase")]
micro minimumIndex(nums: ArrayList<i64>) -> i64 {
    let n: usize = nums.length()
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut index: usize = 0
    while index < n {
        let value: i64 = nums⁅index⁆
        if counts.contains_key(value) {
            counts.insert(value, counts.get(value).unwrap() + 1)
        } else {
            counts.insert(value, 1)
        }
        index = index + 1
    }

    let keys: ArrayList<i64> = counts.keys()
    let mut dominant: i64 = nums⁅0⁆
    let mut top: i64 = 0
    let mut cursor: usize = 0
    while cursor < keys.length() {
        let value: i64 = keys⁅cursor⁆
        let amount: i64 = counts.get(value).unwrap()
        if amount > top {
            top = amount
            dominant = value
        }
        cursor = cursor + 1
    }

    let mut left: i64 = 0
    index = 0
    while index < n {
        if nums⁅index⁆ == dominant {
            left = left + 1
            let left_size: i64 = (index + 1) as i64
            let right_size: i64 = (n - index - 1) as i64
            if left * 2 > left_size && (top - left) * 2 > right_size {
                return index as i64
            }
        }
        index = index + 1
    }
    return -1
}

class Solution {
    micro minimumIndex(self, nums: ArrayList<i64>): i64 {
        return minimumIndex(nums)
    }
}
