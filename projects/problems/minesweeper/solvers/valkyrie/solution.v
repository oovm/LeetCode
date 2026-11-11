namespace leetcode.minesweeper;

using std.collection;
using std.text;

# 扫雷：`'M'` 被点中直接翻 `'X'`；否则统计八邻 `'M'` 数量，为 0 则翻 `'B'` 并递归邻 `'E'`，
# 否则翻成数字字符。`char as u32` 码位比较。
micro count_mines(board: ArrayList<ArrayList<utf8>>, rows: usize, cols: usize, i: usize, j: usize) -> i64 {
    let mut count: i64 = 0
    let mut di: i64 = -1
    while di <= 1 {
        let mut dj: i64 = -1
        while dj <= 1 {
            let ni: i64 = i as i64 + di
            let nj: i64 = j as i64 + dj
            if ni >= 0 && ni < rows as i64 && nj >= 0 && nj < cols as i64 {
                if board⁅ni as usize⁆⁅nj as usize⁆⁅0⁆ as u32 == 77 {
                    count = count + 1
                }
            }
            dj = dj + 1
        }
        di = di + 1
    }
    return count
}

micro reveal(board: ArrayList<ArrayList<utf8>>, rows: usize, cols: usize, i: usize, j: usize) -> unit {
    let code: u32 = board⁅i⁆⁅j⁆⁅0⁆ as u32
    if code != 69 {
        return
    }
    let mines: i64 = count_mines(board, rows, cols, i, j)
    if mines == 0 {
        board⁅i⁆⁅j⁆ = "B"
        let mut di: i64 = -1
        while di <= 1 {
            let mut dj: i64 = -1
            while dj <= 1 {
                let ni: i64 = i as i64 + di
                let nj: i64 = j as i64 + dj
                if ni >= 0 && ni < rows as i64 && nj >= 0 && nj < cols as i64 {
                    reveal(board, rows, cols, ni as usize, nj as usize)
                }
                dj = dj + 1
            }
            di = di + 1
        }
    } else {
        let mut builder: Utf8Builder = Utf8Builder::new(0)
        builder.append(((48 + mines) as u32) as char)
        board⁅i⁆⁅j⁆ = builder.build()
    }
}

[export(case: "camelCase")]
micro updateBoard(board: ArrayList<ArrayList<utf8>>, click: ArrayList<i64>) -> ArrayList<ArrayList<utf8>> {
    let rows: usize = board.length()
    let cols: usize = board⁅0⁆.length()
    let i: usize = click⁅0⁆ as usize
    let j: usize = click⁅1⁆ as usize
    if board⁅i⁆⁅j⁆⁅0⁆ as u32 == 77 {
        board⁅i⁆⁅j⁆ = "X"
    } else {
        reveal(board, rows, cols, i, j)
    }
    return board
}

class Solution {
    micro updateBoard(self, board: ArrayList<ArrayList<utf8>>, click: ArrayList<i64>): ArrayList<ArrayList<utf8>> {
        return updateBoard(board, click)
    }
}
