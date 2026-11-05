namespace leetcode.minimum_falling_path_sum;

using std.collection;

# 逐行滚动：`f[j]` 是上一行落到第 j 列的最小路径和，本行只需三个相邻列的最小值。
# 时间 O(m * n)，额外空间 O(n)。
[export(case: "camelCase")]
micro min_falling_path_sum(matrix: ArrayList<ArrayList<i64>>) -> i64 {
    let height: usize = matrix.length()
    if height == 0 {
        return 0
    }
    let width: usize = matrix⁅0⁆.length()
    if width == 0 {
        return 0
    }
    let mut previous: ArrayList<i64> = ArrayList::new(width)
    let mut fill: usize = 0
    while fill < width {
        previous.push(0)
        fill = fill + 1
    }
    let mut row: usize = 0
    while row < height {
        let cells: ArrayList<i64> = matrix⁅row⁆
        let mut current: ArrayList<i64> = ArrayList::new(width)
        let mut slot: usize = 0
        while slot < width {
            current.push(0)
            slot = slot + 1
        }
        let mut col: usize = 0
        while col < cells.length() && col < width {
            let mut low: usize = col
            if col > 0 {
                low = col - 1
            }
            let mut high: usize = col + 1
            if high >= width {
                high = width - 1
            }
            let mut best: i64 = previous⁅low⁆
            let mut probe: usize = low + 1
            while probe <= high {
                if previous⁅probe⁆ < best {
                    best = previous⁅probe⁆
                }
                probe = probe + 1
            }
            current⁅col⁆ = best + cells⁅col⁆
            col = col + 1
        }
        previous = current
        row = row + 1
    }
    let mut best: i64 = previous⁅0⁆
    let mut scan: usize = 1
    while scan < width {
        if previous⁅scan⁆ < best {
            best = previous⁅scan⁆
        }
        scan = scan + 1
    }
    return best
}

class Solution {
    micro minFallingPathSum(self, matrix: ArrayList<ArrayList<i64>>): i64 {
        return min_falling_path_sum(matrix)
    }
}
