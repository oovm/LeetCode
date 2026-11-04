namespace leetcode.the_k_weakest_rows_in_a_matrix;

using std.collection;

# `bisect_right` 求目标的右边界，用于 `n - 逆序行上的右边界` 得到行强度。
micro bisect_right(values: ArrayList<i64>, target: i64) -> usize {
    let mut low: usize = 0
    let mut high: usize = values.length()
    while low < high {
        let middle: usize = (low + high) / 2
        if target < values⁅middle⁆ {
            high = middle
        } else {
            low = middle + 1
        }
    }
    return low
}

micro strengths_of(mat: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let rows: usize = mat.length()
    let mut strength: ArrayList<i64> = ArrayList::new(rows)
    let mut row_index: usize = 0
    while row_index < rows {
        let row: ArrayList<i64> = mat⁅row_index⁆
        let width: usize = row.length()
        let mut reversed: ArrayList<i64> = ArrayList::new(width)
        let mut column: usize = 0
        while column < width {
            reversed.push(row⁅width - 1 - column⁆)
            column = column + 1
        }
        strength.push((width - bisect_right(reversed, 0)) as i64)
        row_index = row_index + 1
    }
    return strength
}

[export(case: "camelCase")]
micro k_weakest_rows(mat: ArrayList<ArrayList<i64>>, k: i64) -> ArrayList<i64> {
    let strength: ArrayList<i64> = strengths_of(mat)
    let rows: usize = mat.length()
    let mut order: ArrayList<i64> = ArrayList::new(rows)
    let mut row_index: usize = 0
    while row_index < rows {
        order.push(row_index as i64)
        row_index = row_index + 1
    }
    # 比较器捕获外层 `strength`：先比行强度，再按行号升序，保证并列时结果稳定。
    order = sorted_by(order, micro(a: i64, b: i64) -> i32 {
        let left: i64 = strength⁅a as usize⁆
        let right: i64 = strength⁅b as usize⁆
        if left < right {
            return -1
        }
        if left > right {
            return 1
        }
        if a < b {
            return -1
        }
        if a > b {
            return 1
        }
        return 0
    })

    let take: usize = k as usize
    let mut result: ArrayList<i64> = ArrayList::new(take)
    let mut cursor: usize = 0
    while cursor < take {
        result.push(order⁅cursor⁆)
        cursor = cursor + 1
    }
    return result
}

class Solution {
    micro kWeakestRows(self, mat: ArrayList<ArrayList<i64>>, k: i64): ArrayList<i64> {
        return k_weakest_rows(mat, k)
    }
}
