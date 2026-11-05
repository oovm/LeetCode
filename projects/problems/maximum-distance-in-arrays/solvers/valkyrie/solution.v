namespace leetcode.maximum_distance_in_arrays;

using std.collection;

# 一次遍历：用已处理区间的最小首元素与最大末元素，与当前区间的另一端比较。
# 每个区间只看首末两个值，O(区间数)。
micro absolute(value: i64) -> i64 {
    if value < 0 {
        return -value
    }
    return value
}

[export(case: "camelCase")]
micro max_distance(arrays: ArrayList<ArrayList<i64>>) -> i64 {
    let first: ArrayList<i64> = arrays⁅0⁆
    let mut minimum: i64 = first⁅0⁆
    let mut maximum: i64 = first⁅first.length() - 1⁆
    let mut best: i64 = 0

    let mut index: usize = 1
    while index < arrays.length() {
        let current: ArrayList<i64> = arrays⁅index⁆
        let head: i64 = current⁅0⁆
        let tail: i64 = current⁅current.length() - 1⁆
        let spread_from_max: i64 = absolute(head - maximum)
        let spread_from_min: i64 = absolute(tail - minimum)
        if spread_from_max > best {
            best = spread_from_max
        }
        if spread_from_min > best {
            best = spread_from_min
        }
        if head < minimum {
            minimum = head
        }
        if tail > maximum {
            maximum = tail
        }
        index = index + 1
    }
    return best
}

class Solution {
    micro maxDistance(self, arrays: ArrayList<ArrayList<i64>>): i64 {
        return max_distance(arrays)
    }
}
