namespace leetcode.best_sightseeing_pair;

using std.collection;

# 一边遍历一边维护 `values[i] + i` 的最大值，当前点只需配对历史最优，一趟 O(n)。
[export(case: "camelCase")]
micro maxScoreSightseeingPair(values: ArrayList<i64>) -> i64 {
    let mut best_left: i64 = values⁅0⁆
    let mut best: i64 = 0 - 1000000000
    let mut j: i64 = 1
    while j < values.length() as i64 {
        let candidate: i64 = best_left + values⁅j as usize⁆ - j
        if candidate > best {
            best = candidate
        }
        let left: i64 = values⁅j as usize⁆ + j
        if left > best_left {
            best_left = left
        }
        j = j + 1
    }
    return best
}

class Solution {
    micro maxScoreSightseeingPair(self, values: ArrayList<i64>): i64 {
        return maxScoreSightseeingPair(values)
    }
}
