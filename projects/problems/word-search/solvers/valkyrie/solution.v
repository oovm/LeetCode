namespace leetcode.word_search;

using std.collection;

# 逐格 DFS 回溯：命中即临时置 "#" 防复用，四向递归后还原；`char as u32` 码位比较。
micro dfs(board: ArrayList<ArrayList<utf8>>, rows: usize, cols: usize, r: usize, c: usize, word: utf8, k: usize) -> bool {
    if r >= rows || c >= cols {
        return false
    }
    if (board⁅r⁆⁅c⁆⁅0⁆ as u32) != (word⁅k⁆ as u32) {
        return false
    }
    if k + 1 == word.length() {
        return true
    }
    let saved: utf8 = board⁅r⁆⁅c⁆
    board⁅r⁆⁅c⁆ = "#"
    let mut found: bool = false
    if r > 0 {
        found = dfs(board, rows, cols, r - 1, c, word, k + 1)
    }
    if !found && r + 1 < rows {
        found = dfs(board, rows, cols, r + 1, c, word, k + 1)
    }
    if !found && c > 0 {
        found = dfs(board, rows, cols, r, c - 1, word, k + 1)
    }
    if !found && c + 1 < cols {
        found = dfs(board, rows, cols, r, c + 1, word, k + 1)
    }
    board⁅r⁆⁅c⁆ = saved
    return found
}

[export(case: "camelCase")]
micro exist(board: ArrayList<ArrayList<utf8>>, word: utf8) -> bool {
    if word.length() == 0 {
        return true
    }
    let rows: usize = board.length()
    if rows == 0 {
        return false
    }
    let cols: usize = board⁅0⁆.length()
    let mut i: usize = 0
    while i < rows {
        let mut j: usize = 0
        while j < cols {
            if dfs(board, rows, cols, i, j, word, 0) {
                return true
            }
            j = j + 1
        }
        i = i + 1
    }
    return false
}

class Solution {
    micro exist(self, board: ArrayList<ArrayList<utf8>>, word: utf8): bool {
        return exist(board, word)
    }
}
