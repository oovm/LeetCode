namespace leetcode.moving_stones_until_consecutive;

# 排序后：最小移动数为 0/1/2 三档，最大移动数为两端空隙之和。
[export(case: "camelCase")]
micro num_moves_stones(a: i64, b: i64, c: i64) -> ArrayList<i64> {
    let mut x: i64 = a
    let mut y: i64 = b
    let mut z: i64 = c
    if x > y {
        let temp: i64 = x
        x = y
        y = temp
    }
    if y > z {
        let temp: i64 = y
        y = z
        z = temp
    }
    if x > y {
        let temp: i64 = x
        x = y
        y = temp
    }
    let mut min_moves: i64 = 2
    if y - x == 1 && z - y == 1 {
        min_moves = 0
    } else {
        if y - x <= 2 || z - y <= 2 {
            min_moves = 1
        }
    }
    let max_moves: i64 = (y - x - 1) + (z - y - 1)
    let mut answer: ArrayList<i64> = ArrayList::new(2)
    answer.push(min_moves)
    answer.push(max_moves)
    return answer
}

class Solution {
    micro numMovesStones(self, a: i64, b: i64, c: i64): ArrayList<i64> {
        return num_moves_stones(a, b, c)
    }
}
