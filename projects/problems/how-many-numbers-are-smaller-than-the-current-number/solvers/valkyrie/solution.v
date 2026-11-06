namespace leetcode.how_many_numbers_are_smaller_than_the_current_number;

using std.collection;

micro compare_ascending(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 排序后某值首次出现的位置就是小于它的元素个数。
[export(case: "camelCase")]
micro smallerNumbersThanCurrent(nums: ArrayList<i64>) -> ArrayList<i64> {
    let ordered: ArrayList<i64> = sorted_by(nums, compare_ascending)
    let mut rank: HashMap<i64, i64> = HashMap::new(0)
    let mut position: usize = 0
    while position < ordered.length() {
        let value: i64 = ordered⁅position⁆
        if !rank.contains_key(value) {
            rank.insert(value, position as i64)
        }
        position = position + 1
    }

    let mut answer: ArrayList<i64> = ArrayList::new(nums.length())
    position = 0
    while position < nums.length() {
        answer.push(rank.get(nums⁅position⁆).unwrap())
        position = position + 1
    }
    return answer
}

class Solution {
    micro smallerNumbersThanCurrent(self, nums: ArrayList<i64>): ArrayList<i64> {
        return smallerNumbersThanCurrent(nums)
    }
}
