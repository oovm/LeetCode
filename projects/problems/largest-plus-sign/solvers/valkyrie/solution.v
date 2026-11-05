namespace leetcode.largest_plus_sign;

using std.collection;

# 先横后纵两次扫描，维护每个格子四向连续空地的臂长并取最小值，
# 答案是所有格子里的最大阶数，O(n^2)。
[export(case: "camelCase")]
micro order_of_largest_plus_sign(n: i64, mines: ArrayList<ArrayList<i64>>) -> i64 {
    let total: usize = (n * n) as usize
    let mut grid: ArrayList<i64> = ArrayList::new(total)
    let mut index: i64 = 0
    while index < n * n {
        grid.push(0)
        index = index + 1
    }
    let mut mine_index: usize = 0
    while mine_index < mines.length() {
        let mine: ArrayList<i64> = mines⁅mine_index⁆
        let row: i64 = mine⁅0⁆
        let column: i64 = mine⁅1⁆
        grid⁅(row * n + column) as usize⁆ = 1
        mine_index = mine_index + 1
    }

    let mut best: ArrayList<i64> = ArrayList::new(total)
    index = 0
    while index < n * n {
        best.push(0)
        index = index + 1
    }

    let mut row: i64 = 0
    while row < n {
        let base: i64 = row * n
        let mut left: i64 = 0
        let mut column: i64 = 0
        while column < n {
            let at: usize = (base + column) as usize
            if grid⁅at⁆ == 1 {
                left = 0
            } else {
                left = left + 1
            }
            best⁅at⁆ = left
            column = column + 1
        }
        let mut right: i64 = 0
        column = n - 1
        while column >= 0 {
            let at: usize = (base + column) as usize
            if grid⁅at⁆ == 1 {
                right = 0
            } else {
                right = right + 1
            }
            if right < best⁅at⁆ {
                best⁅at⁆ = right
            }
            column = column - 1
        }
        row = row + 1
    }

    let mut column: i64 = 0
    while column < n {
        let mut up: i64 = 0
        let mut row: i64 = 0
        while row < n {
            let at: usize = (row * n + column) as usize
            if grid⁅at⁆ == 1 {
                up = 0
            } else {
                up = up + 1
            }
            if up < best⁅at⁆ {
                best⁅at⁆ = up
            }
            row = row + 1
        }
        let mut down: i64 = 0
        row = n - 1
        while row >= 0 {
            let at: usize = (row * n + column) as usize
            if grid⁅at⁆ == 1 {
                down = 0
            } else {
                down = down + 1
            }
            if down < best⁅at⁆ {
                best⁅at⁆ = down
            }
            row = row - 1
        }
        column = column + 1
    }

    let mut answer: i64 = 0
    index = 0
    while index < n * n {
        if best⁅index as usize⁆ > answer {
            answer = best⁅index as usize⁆
        }
        index = index + 1
    }
    return answer
}

class Solution {
    micro orderOfLargestPlusSign(self, n: i64, mines: ArrayList<ArrayList<i64>>): i64 {
        return order_of_largest_plus_sign(n, mines)
    }
}
