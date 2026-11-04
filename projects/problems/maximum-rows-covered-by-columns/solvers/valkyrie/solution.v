namespace leetcode.solution

using std.collection

# 题内触发点: G25 —— 列集合用 `BitSet` 表示，逐行判断「选中的列是否都被该行的 1 覆盖」。
# 判定用差集：`chosen - row` 为空则整行被覆盖；差集会改写左操作数，故每行先复制：
#   [待补 API] micro clone(self) -> BitSet        # 每行判定前复制选中的列集合（G25）
# `difference(mut self, other)` / `is_empty()` 为现有入口。
micro row_bits(row: ArrayList<i64>) -> BitSet {
    let width: usize = row.length()
    let mut bits: BitSet = BitSet::with_capacity(width)
    let mut index: usize = 0
    while index < width {
        if row⁅index⁆ != 0 {
            bits.set(index)
        }
        index = index + 1
    }
    return bits
}

# 枚举大小为 num_select 的列子集；到叶子时逐行计覆盖数。
micro probe(rows: ArrayList<BitSet>, row_count: usize, width: usize, num_select: usize, start: usize, chosen: BitSet, chosen_count: usize) -> i64 {
    if chosen_count == num_select {
        let mut covered: i64 = 0
        let mut r: usize = 0
        while r < row_count {
            let mut extra: BitSet = chosen.clone()
            extra.difference(rows⁅r⁆)
            if extra.is_empty() {
                covered = covered + 1
            }
            r = r + 1
        }
        return covered
    }

    let mut best: i64 = 0
    let mut column: usize = start
    while column < width {
        # 剩余可选列不足以凑满 num_select 时提前收手。
        if width - column < num_select - chosen_count {
            return best
        }
        chosen.set(column)
        let candidate: i64 = probe(rows, row_count, width, num_select, column + 1, chosen, chosen_count + 1)
        chosen.clear_bit(column)
        if candidate > best {
            best = candidate
        }
        column = column + 1
    }
    return best
}

class Solution {
    [export(case: "maximumRows")]
    micro maximumRows(matrix: ArrayList<ArrayList<i64>>, numSelect: i64) -> i64 {
        let row_count: usize = matrix.length()
        if row_count == 0 {
            return 0
        }
        let width: usize = matrix⁅0⁆.length()

        let mut rows: ArrayList<BitSet> = ArrayList::new(row_count)
        let mut index: usize = 0
        while index < row_count {
            rows.push(row_bits(matrix⁅index⁆))
            index = index + 1
        }

        let mut chosen: BitSet = BitSet::with_capacity(width)
        return probe(rows, row_count, width, numSelect as usize, 0, chosen, 0)
    }
}
