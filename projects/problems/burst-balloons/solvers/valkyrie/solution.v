namespace leetcode.solution

using std.collection

# 题内触发点: 区间 DP；只用到 `ArrayList` 与下标读写，不依赖自定义记录排序。
class Solution {
    [export(case: "camelCase")]
    micro maxCoins(nums: ArrayList<i64>) -> i64 {
        let count: usize = nums.length()
        let size: usize = count + 2
        let mut values: ArrayList<i64> = ArrayList::new(size)
        values.push(1)
        loop value in nums {
            values.push(value)
        }
        values.push(1)

        let mut table: ArrayList<ArrayList<i64>> = ArrayList::new(size)
        let mut row_index: usize = 0
        while row_index < size {
            let mut row: ArrayList<i64> = ArrayList::new(size)
            let mut column: usize = 0
            while column < size {
                row.push(0)
                column = column + 1
            }
            table.push(row)
            row_index = row_index + 1
        }

        let mut span: usize = 1
        while span <= count {
            let mut start: usize = 1
            while start + span <= count + 1 {
                let last: usize = start + span - 1
                let mut pivot: usize = start
                while pivot <= last {
                    let left_part: i64 = table⁅start⁆⁅pivot - 1⁆
                    let right_part: i64 = table⁅pivot + 1⁆⁅last⁆
                    let gain: i64 = left_part + values⁅start - 1⁆ * values⁅pivot⁆ * values⁅last + 1⁆ + right_part
                    if gain > table⁅start⁆⁅last⁆ {
                        table⁅start⁆⁅last⁆ = gain
                    }
                    pivot = pivot + 1
                }
                start = start + 1
            }
            span = span + 1
        }
        return table⁅1⁆⁅count⁆
    }
}
