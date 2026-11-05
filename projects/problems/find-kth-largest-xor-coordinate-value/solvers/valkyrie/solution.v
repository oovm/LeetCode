namespace leetcode.find_kth_largest_xor_coordinate_value;

using std.collection;

micro median_of_three(a: i64, b: i64, c: i64) -> i64 {
    if a < b {
        if b < c {
            return b
        }
        if a < c {
            return c
        }
        return a
    }
    if a < c {
        return a
    }
    if b < c {
        return c
    }
    return b
}

# 三分快选（median-of-three 选枢轴），平均 O(V)、V = 行数 × 列数。
micro kth_largest(mut values: ArrayList<i64>, k: i64) -> i64 {
    let count: i64 = values.length() as i64
    let target: i64 = count - k
    let mut left: i64 = 0
    let mut right: i64 = count - 1
    while left < right {
        let pivot: i64 = median_of_three(
            values⁅left as usize⁆,
            values⁅(left + (right - left) / 2) as usize⁆,
            values⁅right as usize⁆
        )
        let mut low: i64 = left
        let mut cursor: i64 = left
        let mut high: i64 = right
        while cursor <= high {
            let current: i64 = values⁅cursor as usize⁆
            if current < pivot {
                let temp: i64 = values⁅low as usize⁆
                values⁅low as usize⁆ = current
                values⁅cursor as usize⁆ = temp
                low = low + 1
                cursor = cursor + 1
            } else if current > pivot {
                let temp: i64 = values⁅high as usize⁆
                values⁅high as usize⁆ = current
                values⁅cursor as usize⁆ = temp
                high = high - 1
            } else {
                cursor = cursor + 1
            }
        }
        if target < low {
            right = low - 1
        } else if target > high {
            left = high + 1
        } else {
            return pivot
        }
    }
    return values⁅left as usize⁆
}

# 二维前缀异或 O(行列)，再对全部下标异或值做快选取第 k 大。
[export(case: "camelCase")]
micro kth_largest_value(matrix: ArrayList<ArrayList<i64>>, k: i64) -> i64 {
    let rows: i64 = matrix.length() as i64
    let columns: i64 = matrix⁅0⁆.length() as i64
    let stride: i64 = columns + 1
    let prefix_size: i64 = (rows + 1) * stride

    let mut prefix: ArrayList<i64> = ArrayList::new(prefix_size as usize)
    loop _zero in 0..(prefix_size as usize) {
        prefix.push(0)
    }

    let mut values: ArrayList<i64> = ArrayList::new((rows * columns) as usize)
    let mut row: i64 = 1
    while row <= rows {
        let mut column: i64 = 1
        while column <= columns {
            let cell: i64 = matrix⁅(row - 1) as usize⁆⁅(column - 1) as usize⁆
            let value: i64 = prefix⁅((row - 1) * stride + column) as usize⁆
                ^ prefix⁅(row * stride + (column - 1)) as usize⁆
                ^ prefix⁅((row - 1) * stride + (column - 1)) as usize⁆
                ^ cell
            prefix⁅(row * stride + column) as usize⁆ = value
            values.push(value)
            column = column + 1
        }
        row = row + 1
    }
    return kth_largest(values, k)
}

class Solution {
    micro kthLargestValue(self, matrix: ArrayList<ArrayList<i64>>, k: i64): i64 {
        return kth_largest_value(matrix, k)
    }
}
