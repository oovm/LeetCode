namespace leetcode.determine_the_winner_of_a_bowling_game;

using std.collection;

micro scoreFor(rolls: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    let mut index: usize = 0
    while index < rolls.length() {
        let mut factor: i64 = 1
        if index > 0 && rolls⁅index - 1⁆ == 10 {
            factor = 2
        } else {
            if index > 1 && rolls⁅index - 2⁆ == 10 {
                factor = 2
            }
        }
        total = total + factor * rolls⁅index⁆
        index = index + 1
    }
    return total
}

# 分别计算两名玩家得分，再比较大小。
[export(case: "camelCase")]
micro isWinner(player1: ArrayList<i64>, player2: ArrayList<i64>) -> i64 {
    let first: i64 = scoreFor(player1)
    let second: i64 = scoreFor(player2)
    if first > second {
        return 1
    }
    if second > first {
        return 2
    }
    return 0
}

class Solution {
    micro isWinner(self, player1: ArrayList<i64>, player2: ArrayList<i64>): i64 {
        return isWinner(player1, player2)
    }
}
