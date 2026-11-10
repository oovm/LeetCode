namespace leetcode.bomb_enemy;

using std.collection;

# 行/列命中数按墙分段缓存：段起点重扫一次，逐格取当前行段与列段之和。
[export(case: "camelCase")]
micro maxKilledEnemies(grid: ArrayList<ArrayList<utf8>>) -> i64 {
    let rows: usize = grid.length()
    let columns: usize = grid⁅0⁆.length()
    let mut best: i64 = 0
    let mut rowHits: i64 = 0
    let mut colHits: ArrayList<i64> = ArrayList::new(columns)
    let mut slot: usize = 0
    while slot < columns {
        colHits.push(0)
        slot = slot + 1
    }
    let mut row: usize = 0
    while row < rows {
        let mut column: usize = 0
        while column < columns {
            if column == 0 || grid⁅row⁆⁅column - 1⁆ == "W" {
                rowHits = 0
                let mut k: usize = column
                while k < columns && grid⁅row⁆⁅k⁆ != "W" {
                    if grid⁅row⁆⁅k⁆ == "E" {
                        rowHits = rowHits + 1
                    }
                    k = k + 1
                }
            }
            if row == 0 || grid⁅row - 1⁆⁅column⁆ == "W" {
                colHits⁅column⁆ = 0
                let mut k: usize = row
                while k < rows && grid⁅k⁆⁅column⁆ != "W" {
                    if grid⁅k⁆⁅column⁆ == "E" {
                        colHits⁅column⁆ = colHits⁅column⁆ + 1
                    }
                    k = k + 1
                }
            }
            if grid⁅row⁆⁅column⁆ == "0" {
                let total: i64 = rowHits + colHits⁅column⁆
                if total > best {
                    best = total
                }
            }
            column = column + 1
        }
        row = row + 1
    }
    return best
}

class Solution {
    micro maxKilledEnemies(self, grid: ArrayList<ArrayList<utf8>>): i64 {
        return maxKilledEnemies(grid)
    }
}
