namespace leetcode.solution

using std.collection

# 题内触发点: 每行 / 每列 / 每宫各一个 `BitSet(9)`，`get` 查重、`set` 置位。
micro place_digit(rows: ArrayList<BitSet>, cols: ArrayList<BitSet>, boxes: ArrayList<BitSet>, row: usize, col: usize, digit: usize) -> bool {
    let box: usize = (row / 3) * 3 + (col / 3)
    if rows⁅row⁆.get(digit) || cols⁅col⁆.get(digit) || boxes⁅box⁆.get(digit) {
        return false
    }
    rows⁅row⁆.set(digit)
    cols⁅col⁆.set(digit)
    boxes⁅box⁆.set(digit)
    return true
}

class Solution {
    [export(case: "isValidSudoku")]
    micro isValidSudoku(board: ArrayList<ArrayList<utf8>>) -> bool {
        let rows: ArrayList<BitSet> = ArrayList::new(9)
        let cols: ArrayList<BitSet> = ArrayList::new(9)
        let boxes: ArrayList<BitSet> = ArrayList::new(9)
        let mut group: usize = 0
        while group < 9 {
            rows.push(BitSet::with_capacity(9))
            cols.push(BitSet::with_capacity(9))
            boxes.push(BitSet::with_capacity(9))
            group = group + 1
        }
        let mut row: usize = 0
        while row < 9 {
            let mut col: usize = 0
            while col < 9 {
                let cell: utf8 = board⁅row⁆⁅col⁆
                let code: u8 = cell.byte_at(0)
                if code != 46 {
                    let digit: usize = (code - 49) as usize
                    if !place_digit(rows, cols, boxes, row, col, digit) {
                        return false
                    }
                }
                col = col + 1
            }
            row = row + 1
        }
        return true
    }
}
