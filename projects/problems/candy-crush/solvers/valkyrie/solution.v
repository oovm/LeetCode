namespace leetcode.candy_crush;

using std.collection;

# 每轮标记横/竖连续 ≥3 的格子并清零，再按列做重力下落，直到没有可消。
# 单轮 O(r*c)，轮数受版面上限约束。
micro mark_horizontal(board: ArrayList<ArrayList<i64>>, marked: ArrayList<ArrayList<i64>>, rows: usize, columns: usize) -> unit {
    let mut row_index: usize = 0
    while row_index < rows {
        let row: ArrayList<i64> = board⁅row_index⁆
        let mark: ArrayList<i64> = marked⁅row_index⁆
        let mut start: usize = 0
        while start < columns {
            let value: i64 = row⁅start⁆
            let mut stop: usize = start + 1
            while stop < columns && row⁅stop⁆ == value {
                stop = stop + 1
            }
            if value != 0 && stop - start >= 3 {
                let mut at: usize = start
                while at < stop {
                    mark⁅at⁆ = 1
                    at = at + 1
                }
            }
            start = stop
        }
        row_index = row_index + 1
    }
}

micro mark_vertical(board: ArrayList<ArrayList<i64>>, marked: ArrayList<ArrayList<i64>>, rows: usize, columns: usize) -> unit {
    let mut column: usize = 0
    while column < columns {
        let mut start: usize = 0
        while start < rows {
            let value: i64 = board⁅start⁆⁅column⁆
            let mut stop: usize = start + 1
            while stop < rows && board⁅stop⁆⁅column⁆ == value {
                stop = stop + 1
            }
            if value != 0 && stop - start >= 3 {
                let mut at: usize = start
                while at < stop {
                    let line: ArrayList<i64> = marked⁅at⁆
                    line⁅column⁆ = 1
                    at = at + 1
                }
            }
            start = stop
        }
        column = column + 1
    }
}

micro crush_once(board: ArrayList<ArrayList<i64>>, rows: usize, columns: usize) -> bool {
    let mut marked: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut row_index: usize = 0
    while row_index < rows {
        let mut line: ArrayList<i64> = ArrayList::new(columns)
        let mut column: usize = 0
        while column < columns {
            line.push(0)
            column = column + 1
        }
        marked.push(line)
        row_index = row_index + 1
    }
    mark_horizontal(board, marked, rows, columns)
    mark_vertical(board, marked, rows, columns)

    let mut changed: bool = false
    row_index = 0
    while row_index < rows {
        let row: ArrayList<i64> = board⁅row_index⁆
        let mark: ArrayList<i64> = marked⁅row_index⁆
        let mut column: usize = 0
        while column < columns {
            if mark⁅column⁆ == 1 {
                if row⁅column⁆ != 0 {
                    changed = true
                }
                row⁅column⁆ = 0
            }
            column = column + 1
        }
        row_index = row_index + 1
    }
    if !changed {
        return false
    }

    let mut column: usize = 0
    while column < columns {
        let mut top: usize = rows
        let mut cursor: usize = rows
        while cursor > 0 {
            cursor = cursor - 1
            let row: ArrayList<i64> = board⁅cursor⁆
            if row⁅column⁆ != 0 {
                top = top - 1
                let target: ArrayList<i64> = board⁅top⁆
                target⁅column⁆ = row⁅column⁆
            }
        }
        while top > 0 {
            top = top - 1
            let target: ArrayList<i64> = board⁅top⁆
            target⁅column⁆ = 0
        }
        column = column + 1
    }
    return true
}

[export(case: "camelCase")]
micro candy_crush(board: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let rows: usize = board.length()
    if rows == 0 {
        return board
    }
    let columns: usize = board⁅0⁆.length()
    while crush_once(board, rows, columns) {
    }
    return board
}

class Solution {
    micro candyCrush(self, board: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return candy_crush(board)
    }
}
