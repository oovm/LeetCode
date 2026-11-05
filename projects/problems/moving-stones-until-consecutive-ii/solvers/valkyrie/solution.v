namespace leetcode.moving_stones_until_consecutive_ii;

using std.collection;

micro compare_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 最小值用滑动窗口找最长可容纳区间，最大值只取决于两端空隙。
[export(case: "camelCase")]
micro num_moves_stones_ii(stones: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = stones.length()
    quick_sort(stones, compare_i64)
    let span_left: i64 = stones⁅count - 1⁆ - stones⁅1⁆ + 1
    let span_right: i64 = stones⁅count - 2⁆ - stones⁅0⁆ + 1
    let mut widest: i64 = span_left
    if span_right > widest {
        widest = span_right
    }
    let maximum: i64 = widest - (count as i64 - 1)
    let mut minimum: i64 = count as i64
    let mut left: usize = 0
    let mut right: usize = 0
    while right < count {
        let far: i64 = stones⁅right⁆
        while far - stones⁅left⁆ + 1 > count as i64 {
            left = left + 1
        }
        let covered: i64 = (right - left + 1) as i64
        let special: bool = covered == count as i64 - 1
        let tight: bool = far - stones⁅left⁆ == count as i64 - 2
        if special {
            if tight {
                if minimum > 2 {
                    minimum = 2
                }
            } else {
                if count as i64 - covered < minimum {
                    minimum = count as i64 - covered
                }
            }
        } else {
            if count as i64 - covered < minimum {
                minimum = count as i64 - covered
            }
        }
        right = right + 1
    }
    let mut result: ArrayList<i64> = ArrayList::new(2)
    result.push(minimum)
    result.push(maximum)
    return result
}

class Solution {
    micro numMovesStonesII(self, stones: ArrayList<i64>): ArrayList<i64> {
        return num_moves_stones_ii(stones)
    }
}
