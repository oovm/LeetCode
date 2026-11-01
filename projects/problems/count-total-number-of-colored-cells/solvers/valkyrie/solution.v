namespace leetcode.count_total_number_of_colored_cells;

[export(case: "camelCase")]
micro colored_cells(n: i64) -> i64 {
    return n * (n - 1) * 2 + 1
}

class Solution {
    micro coloredCells(self, n: i64): i64 {
        return colored_cells(n)
    }
}
