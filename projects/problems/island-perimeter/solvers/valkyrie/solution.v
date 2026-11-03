namespace leetcode.island_perimeter;

[export(case: "camelCase")]
micro island_perimeter(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    let mut perim: i64 = 0
    let mut r: usize = 0
    while r < rows {
        let row: ArrayList<i64> = grid⁅r⁆
        let cols: usize = row.length()
        let mut c: usize = 0
        while c < cols {
            if row⁅c⁆ == 1 {
                perim = perim + 4
                if r > 0 {
                    let above: ArrayList<i64> = grid⁅r - 1⁆
                    if above⁅c⁆ == 1 {
                        perim = perim - 2
                    }
                }
                if c > 0 {
                    if row⁅c - 1⁆ == 1 {
                        perim = perim - 2
                    }
                }
            }
            c = c + 1
        }
        r = r + 1
    }
    return perim
}

class Solution {
    micro islandPerimeter(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return island_perimeter(grid)
    }
}
