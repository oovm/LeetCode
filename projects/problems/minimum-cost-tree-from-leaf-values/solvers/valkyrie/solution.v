namespace leetcode.minimum_cost_tree_from_leaf_values;

using std.collection;

# 区间 DP：dp[i][j] = 区间最小代价，best[i][j] = 区间最大值，转移枚举分割点。
[export(case: "camelCase")]
micro mct_from_leaf_values(arr: ArrayList<i64>) -> i64 {
    let n: i64 = arr.length() as i64
    let stride: i64 = n
    let cells: usize = (n * n) as usize
    let infinity: i64 = 1000000000

    let mut cost: ArrayList<i64> = ArrayList::new(cells)
    let mut largest: ArrayList<i64> = ArrayList::new(cells)
    loop _zero in 0..cells {
        cost.push(0)
        largest.push(0)
    }

    let mut index: i64 = 0
    while index < n {
        largest⁅(index * stride + index) as usize⁆ = arr⁅index as usize⁆
        index = index + 1
    }

    let mut length: i64 = 2
    while length <= n {
        let mut left: i64 = 0
        while left + length <= n {
            let right: i64 = left + length - 1
            let mut best: i64 = infinity
            let mut maximum: i64 = 0
            let mut split: i64 = left
            while split < right {
                let left_cost: i64 = cost⁅(left * stride + split) as usize⁆
                let right_cost: i64 = cost⁅((split + 1) * stride + right) as usize⁆
                let left_max: i64 = largest⁅(left * stride + split) as usize⁆
                let right_max: i64 = largest⁅((split + 1) * stride + right) as usize⁆
                let candidate: i64 = left_cost + right_cost + left_max * right_max
                if candidate < best {
                    best = candidate
                }
                if left_max > maximum {
                    maximum = left_max
                }
                if right_max > maximum {
                    maximum = right_max
                }
                split = split + 1
            }
            cost⁅(left * stride + right) as usize⁆ = best
            largest⁅(left * stride + right) as usize⁆ = maximum
            left = left + 1
        }
        length = length + 1
    }
    return cost⁅(n - 1) as usize⁆
}

class Solution {
    micro mctFromLeafValues(self, arr: ArrayList<i64>): i64 {
        return mct_from_leaf_values(arr)
    }
}
