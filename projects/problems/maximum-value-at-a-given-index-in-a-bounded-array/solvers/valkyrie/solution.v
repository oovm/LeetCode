namespace leetcode.maximum_value_at_a_given_index_in_a_bounded_array;

# 一侧（cnt 个位置）在峰高 h-1 下的最小和。
micro side_sum(h: i64, cnt: i64) -> i64 {
    let peak: i64 = h - 1
    if peak >= cnt {
        return (peak + peak - cnt + 1) * cnt / 2
    }
    return (1 + peak) * peak / 2 + cnt - peak
}

micro total_cost(h: i64, index: i64, n: i64) -> i64 {
    return side_sum(h, index) + side_sum(h, n - 1 - index) + h
}

[export(case: "camelCase")]
micro max_value(n: i64, index: i64, maxSum: i64) -> i64 {
    let mut low: i64 = 1
    let mut high: i64 = maxSum
    while low < high {
        let mid: i64 = (low + high + 1) / 2
        if total_cost(mid, index, n) <= maxSum {
            low = mid
        } else {
            high = mid - 1
        }
    }
    return low
}

class Solution {
    micro maxValue(self, n: i64, index: i64, maxSum: i64): i64 {
        return max_value(n, index, maxSum)
    }
}
