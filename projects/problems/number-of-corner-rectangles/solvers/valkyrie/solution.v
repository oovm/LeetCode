namespace leetcode.solution

using std.collection

# 题内触发点: G25 —— 列数最多 200，超出 i64 掩码，每行必须用一个 `BitSet(cols)`。
# 两行求「同为 1 的列」= `intersect` 后取 `count`（G25 已提供，见缺口账本）。
# 交集的左操作数每对行都重建一次，因此不触发 `clone`；重建成本 O(列数)，对本批规模可接受。
micro row_bits(row: ArrayList<i64>, cols: usize) -> BitSet {
    let mut bits: BitSet = BitSet::with_capacity(cols)
    let mut index: usize = 0
    while index < cols {
        if row⁅index⁆ != 0 {
            bits.set(index)
        }
        index = index + 1
    }
    return bits
}

class Solution {
    [export(case: "camelCase")]
    micro countCornerRectangles(grid: ArrayList<ArrayList<i64>>) -> i64 {
        let rows: usize = grid.length()
        if rows == 0 {
            return 0
        }
        let cols: usize = grid⁅0⁆.length()

        let mut total: i64 = 0
        let mut upper: usize = 0
        while upper < rows {
            let mut lower: usize = upper + 1
            while lower < rows {
                let mut both: BitSet = row_bits(grid⁅upper⁆, cols)
                both.intersect(row_bits(grid⁅lower⁆, cols))
                let shared: i64 = both.count() as i64
                total = total + shared * (shared - 1) / 2
                lower = lower + 1
            }
            upper = upper + 1
        }
        return total
    }
}
