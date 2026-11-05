namespace leetcode.snakes_and_ladders;

using std.collection;

# 蛇梯棋的标签是棋盘的行优先编号，棋盘行号从底往上，奇数行（从底数）左右反向。
# 把每个标签换算成真实格子，踩到蛇或梯就跳到目标格；BFS 求最少掷骰次数。
[export(case: "camelCase")]
micro snakes_and_ladders(board: ArrayList<ArrayList<i64>>) -> i64 {
    let n: i64 = board.length() as i64
    let goal: i64 = n * n
    let mut visited: ArrayList<bool> = ArrayList::new((goal + 1) as usize)
    let mut fill: i64 = 0
    while fill <= goal {
        visited.push(false)
        fill = fill + 1
    }
    let mut queue: ArrayList<i64> = ArrayList::new(1)
    queue.push(1)
    visited⁅1⁆ = true
    let mut head: usize = 0
    let mut rolls: i64 = 0
    while head < queue.length() {
        let level: usize = queue.length() - head
        let mut taken: i64 = 0
        while taken < level as i64 {
            let square: i64 = queue⁅head⁆
            head = head + 1
            if square == goal {
                return rolls
            }
            let mut next: i64 = square + 1
            let limit: i64 = if square + 6 < goal {
                square + 6
            } else {
                goal
            }
            while next <= limit {
                let cell: i64 = (next - 1) / n
                let mut col: i64 = (next - 1) % n
                if cell % 2 == 1 {
                    col = n - col - 1
                }
                let row: i64 = n - cell - 1
                let value: i64 = board⁅row as usize⁆⁅col as usize⁆
                let mut landing: i64 = next
                if value >= 0 {
                    landing = value
                }
                if !visited⁅landing⁆ {
                    visited⁅landing⁆ = true
                    queue.push(landing)
                }
                next = next + 1
            }
            taken = taken + 1
        }
        rolls = rolls + 1
    }
    return -1
}

class Solution {
    micro snakesAndLadders(self, board: ArrayList<ArrayList<i64>>): i64 {
        return snakes_and_ladders(board)
    }
}
