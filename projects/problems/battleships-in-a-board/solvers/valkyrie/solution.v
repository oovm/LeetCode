namespace leetcode.battleships_in_a_board;

using std.collection;

# 每艘战列舰只统计其左上角：本格为 'X' 且上、左邻均不为 'X'。
[export(case: "camelCase")]
micro countBattleships(board: ArrayList<ArrayList<utf8>>) -> i64 {
    let rows: usize = board.length()
    let columns: usize = board⁅0⁆.length()
    let mut count: i64 = 0
    let mut row: usize = 0
    while row < rows {
        let mut column: usize = 0
        while column < columns {
            if board⁅row⁆⁅column⁆ == "X" {
                let shipAbove: bool = row > 0 && board⁅row - 1⁆⁅column⁆ == "X"
                let shipLeft: bool = column > 0 && board⁅row⁆⁅column - 1⁆ == "X"
                if !shipAbove && !shipLeft {
                    count = count + 1
                }
            }
            column = column + 1
        }
        row = row + 1
    }
    return count
}

class Solution {
    micro countBattleships(self, board: ArrayList<ArrayList<utf8>>): i64 {
        return countBattleships(board)
    }
}
