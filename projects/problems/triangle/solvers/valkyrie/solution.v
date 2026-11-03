namespace leetcode.triangle;

# 自底向上压缩到一行。
[export(case: "camelCase")]
micro minimum_total(triangle: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = triangle.length()
    let last: ArrayList<i64> = triangle⁅rows - 1⁆.unwrap()
    let mut dp: ArrayList<i64> = ArrayList::new(last.length())
    let mut j: usize = 0
    while j < last.length() {
        dp.push(last⁅j⁆.unwrap())
        j = j + 1
    }
    let mut i: i64 = (rows as i64) - 2
    while i >= 0 {
        let row: ArrayList<i64> = triangle⁅i as usize⁆.unwrap()
        let mut k: usize = 0
        let mut width: usize = (i as usize) + 1
        while k < width {
            let down: i64 = dp⁅k⁆.unwrap()
            let right: i64 = dp⁅k + 1⁆.unwrap()
            let mut best: i64 = down
            if right < best {
                best = right
            }
            dp⁅k⁆ = row⁅k⁆.unwrap() + best
            k = k + 1
        }
        i = i - 1
    }
    return dp⁅0⁆.unwrap()
}

class Solution {
    micro minimumTotal(self, triangle: ArrayList<ArrayList<i64>>): i64 {
        return minimum_total(triangle)
    }
}
