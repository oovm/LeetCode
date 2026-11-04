namespace leetcode.snake_in_matrix;

using std.collection;

# 直接模拟：按命令首字母更新行列，返回 row * n + col。
# 时间 O(m) 空间 O(1)。
[export(case: "camelCase")]
micro final_position_of_snake(n: i64, commands: ArrayList<utf8>) -> i64 {
    let mut row: i64 = 0
    let mut col: i64 = 0
    let mut i: usize = 0
    while i < commands.length() {
        let command: utf8 = commands⁅i⁆
        let first: u32 = command⁅0⁆ as u32
        if first == 85 {
            row = row - 1
        } else if first == 68 {
            row = row + 1
        } else if first == 76 {
            col = col - 1
        } else {
            col = col + 1
        }
        i = i + 1
    }
    return row * n + col
}

class Solution {
    micro finalPositionOfSnake(self, n: i64, commands: ArrayList<utf8>): i64 {
        return final_position_of_snake(n, commands)
    }
}
