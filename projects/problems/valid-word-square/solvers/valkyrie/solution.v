namespace leetcode.valid_word_square;

# 逐字符核对 `words[i][j] == words[j][i]`：任一侧越界即不是词方阵。
[export(case: "camelCase")]
micro validWordSquare(words: ArrayList<utf8>) -> bool {
    let count: usize = words.length()
    let mut i: usize = 0
    while i < count {
        let row: utf8 = words⁅i⁆
        let mut j: usize = 0
        while j < row.length() {
            if j >= count {
                return false
            }
            let other: utf8 = words⁅j⁆
            if i >= other.length() {
                return false
            }
            if row⁅j⁆ as u32 != other⁅i⁆ as u32 {
                return false
            }
            j = j + 1
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro validWordSquare(self, words: ArrayList<utf8>): bool {
        return validWordSquare(words)
    }
}
