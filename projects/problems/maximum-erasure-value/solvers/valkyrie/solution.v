namespace leetcode.maximum_erasure_value;

using std.collection;

# 前缀和 + 每个数值最近出现位置：左界只会右移，最多挪一次，整体 O(n)。
[export(case: "camelCase")]
micro maximumUniqueSubarray(nums: ArrayList<i64>) -> i64 {
    let count: i64 = nums.length() as i64
    let mut prefix: ArrayList<i64> = ArrayList::new((count + 1) as usize)
    prefix.push(0)
    let mut i: i64 = 0
    while i < count {
        prefix.push(prefix⁅i as usize⁆ + nums⁅i as usize⁆)
        i = i + 1
    }

    let mut last_position: HashMap<i64, i64> = HashMap::new(count as usize)
    let mut left: i64 = 0
    let mut best: i64 = 0
    i = 0
    while i < count {
        let value: i64 = nums⁅i as usize⁆
        if last_position.contains_key(value) {
            let previous: i64 = last_position.get(value).unwrap() + 1
            if previous > left {
                left = previous
            }
        }
        last_position.insert(value, i)
        let window: i64 = prefix⁅(i + 1) as usize⁆ - prefix⁅left as usize⁆
        if window > best {
            best = window
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro maximumUniqueSubarray(self, nums: ArrayList<i64>): i64 {
        return maximumUniqueSubarray(nums)
    }
}
