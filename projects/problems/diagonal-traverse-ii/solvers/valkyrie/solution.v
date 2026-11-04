namespace leetcode.diagonal_traverse_ii;

using std.collection;

# 以 `r + c` 分桶：按行号递增扫描时，同一桶内的写入顺序天然是行号升序，
# 展平即可得到题目要求的「对角线序号升序、同对角线行号升序」。
# 题内触发点: 嵌套容器构造 —— 桶表按 `rows + cols` 精确预分配，再逐层建桶。
# 题内触发点: G12 之外的 `ArrayList` 容量形态 —— 每个桶先 `new(0)` 再按需增长。
[export(case: "camelCase")]
micro find_diagonal_order(nums: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let rows: usize = nums.length()
    let mut cols: usize = 0
    loop row in nums {
        if row.length() > cols {
            cols = row.length()
        }
    }

    let mut buckets: ArrayList<ArrayList<i64>> = ArrayList::new(rows + cols)
    let mut slot: usize = 0
    while slot < rows + cols {
        let mut bucket: ArrayList<i64> = ArrayList::new(0)
        buckets.push(bucket)
        slot = slot + 1
    }

    let mut row_index: usize = 0
    while row_index < rows {
        let row: ArrayList<i64> = nums⁅row_index⁆
        let mut col_index: usize = 0
        while col_index < row.length() {
            buckets⁅row_index + col_index⁆.push(row⁅col_index⁆)
            col_index = col_index + 1
        }
        row_index = row_index + 1
    }

    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(rows + cols)
    slot = 0
    while slot < buckets.length() {
        if buckets⁅slot⁆.length() > 0 {
            result.push(buckets⁅slot⁆)
        }
        slot = slot + 1
    }
    return result
}

class Solution {
    micro findDiagonalOrder(self, nums: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return find_diagonal_order(nums)
    }
}
