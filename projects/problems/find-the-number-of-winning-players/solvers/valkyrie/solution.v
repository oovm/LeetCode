namespace leetcode.find_the_number_of_winning_players;

using std.collection;

# 玩家 x 只要某一种球的取球次数超过 x 就成为赢家，每个玩家最多计一次。
[export(case: "camelCase")]
micro winningPlayerCount(n: i64, pick: ArrayList<ArrayList<i64>>) -> i64 {
    let players: usize = n as usize
    let mut counts: ArrayList<ArrayList<i64>> = ArrayList::new(players)
    let mut wins: ArrayList<i64> = ArrayList::new(players)
    let mut index: usize = 0
    while index < players {
        let mut colors: ArrayList<i64> = ArrayList::new(11)
        let mut color: i64 = 0
        while color < 11 {
            colors.push(0)
            color = color + 1
        }
        counts.push(colors)
        wins.push(0)
        index = index + 1
    }

    let mut answer: i64 = 0
    loop entry in pick {
        let player: usize = entry⁅0⁆ as usize
        let color: usize = entry⁅1⁆ as usize
        let colors: ArrayList<i64> = counts⁅player⁆
        colors⁅color⁆ = colors⁅color⁆ + 1
        if colors⁅color⁆ > player as i64 && wins⁅player⁆ == 0 {
            wins⁅player⁆ = 1
            answer = answer + 1
        }
    }
    return answer
}

class Solution {
    micro winningPlayerCount(self, n: i64, pick: ArrayList<ArrayList<i64>>): i64 {
        return winningPlayerCount(n, pick)
    }
}
