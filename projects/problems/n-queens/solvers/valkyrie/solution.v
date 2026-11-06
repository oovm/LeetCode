namespace leetcode.solution

using std.collection
using std.text

# 题内触发点: G25（已存在面的真实调用点）—— 列 / 两条对角线各一个 `BitSet`，
# 回溯时 `set` 占位、`clear_bit` 撤销，`get` 判定冲突。本解只用现有入口，不调 `clone` / `count`，
# 也不依赖迭代 / 互转 / `Equal`：棋盘由列栈逐行渲染，不需要枚举置位。
micro render(placements: ArrayList<i64>, size: usize) -> ArrayList<utf8> {
    let mut board: ArrayList<utf8> = ArrayList::new(size)
    let mut row: usize = 0
    while row < size {
        let queen: i64 = placements⁅row⁆
        let mut builder: Utf8Builder = Utf8Builder::new(size)
        let mut column: usize = 0
        while column < size {
            if (column as i64) == queen {
                builder.append(char::from(81 as u32))
            } else {
                builder.append(char::from(46 as u32))
            }
            column = column + 1
        }
        board.push(builder.build())
        row = row + 1
    }
    return board
}

# 第 row 行逐列试放；列下标 0 基，故「行 - 列」平移 size - 1 后作下沉对角线下标。
micro place(row: usize, size: usize, columns: BitSet, downward: BitSet, upward: BitSet, placements: ArrayList<i64>, results: ArrayList<ArrayList<utf8>>) -> unit {
    if row == size {
        results.push(render(placements, size))
        return
    }

    let mut column: usize = 0
    while column < size {
        let down_slot: usize = row + size - 1 - column
        let up_slot: usize = row + column
        if !columns.get(column) && !downward.get(down_slot) && !upward.get(up_slot) {
            columns.set(column)
            downward.set(down_slot)
            upward.set(up_slot)
            placements.push(column as i64)
            place(row + 1, size, columns, downward, upward, placements, results)
            let dropped: i64 = placements.pop().unwrap()
            columns.clear_bit(column)
            downward.clear_bit(down_slot)
            upward.clear_bit(up_slot)
        }
        column = column + 1
    }
}

class Solution {
    [export(case: "camelCase")]
    micro solveNQueens(n: i64) -> ArrayList<ArrayList<utf8>> {
        let size: usize = n as usize
        let mut columns: BitSet = BitSet::with_capacity(size)
        let mut downward: BitSet = BitSet::with_capacity(size * 2)
        let mut upward: BitSet = BitSet::with_capacity(size * 2)
        let mut placements: ArrayList<i64> = ArrayList::new(size)
        let mut results: ArrayList<ArrayList<utf8>> = ArrayList::new(0)
        place(0, size, columns, downward, upward, placements, results)
        return results
    }
}
