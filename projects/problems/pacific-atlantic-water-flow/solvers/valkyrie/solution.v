namespace leetcode.pacific_atlantic_water_flow;

using std.collection;

# 双海岸 DFS：从太平洋上/左缘与大西洋下/右缘分别向上游漫流，取交集即答案。
micro flow(heights: ArrayList<ArrayList<i64>>, seen: ArrayList<ArrayList<i64>>, rows: usize, cols: usize, i: usize, j: usize) -> unit {
    seen⁅i⁆⁅j⁆ = 1
    let value: i64 = heights⁅i⁆⁅j⁆
    if i > 0 && seen⁅i - 1⁆⁅j⁆ == 0 && heights⁅i - 1⁆⁅j⁆ >= value {
        flow(heights, seen, rows, cols, i - 1, j)
    }
    if i + 1 < rows && seen⁅i + 1⁆⁅j⁆ == 0 && heights⁅i + 1⁆⁅j⁆ >= value {
        flow(heights, seen, rows, cols, i + 1, j)
    }
    if j > 0 && seen⁅i⁆⁅j - 1⁆ == 0 && heights⁅i⁆⁅j - 1⁆ >= value {
        flow(heights, seen, rows, cols, i, j - 1)
    }
    if j + 1 < cols && seen⁅i⁆⁅j + 1⁆ == 0 && heights⁅i⁆⁅j + 1⁆ >= value {
        flow(heights, seen, rows, cols, i, j + 1)
    }
}

micro make_mask(rows: usize, cols: usize) -> ArrayList<ArrayList<i64>> {
    let mut mask: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut i: usize = 0
    while i < rows {
        let mut row: ArrayList<i64> = ArrayList::new(cols)
        let mut j: usize = 0
        while j < cols {
            row.push(0)
            j = j + 1
        }
        mask.push(row)
        i = i + 1
    }
    return mask
}

[export(case: "camelCase")]
micro pacificAtlantic(heights: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let rows: usize = heights.length()
    if rows == 0 {
        return ArrayList::new(0)
    }
    let cols: usize = heights⁅0⁆.length()
    let mut pacific: ArrayList<ArrayList<i64>> = make_mask(rows, cols)
    let mut atlantic: ArrayList<ArrayList<i64>> = make_mask(rows, cols)
    let mut i: usize = 0
    while i < rows {
        flow(heights, pacific, rows, cols, i, 0)
        flow(heights, atlantic, rows, cols, i, cols - 1)
        i = i + 1
    }
    let mut j: usize = 0
    while j < cols {
        flow(heights, pacific, rows, cols, 0, j)
        flow(heights, atlantic, rows, cols, rows - 1, j)
        j = j + 1
    }
    let mut out: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    i = 0
    while i < rows {
        j = 0
        while j < cols {
            if pacific⁅i⁆⁅j⁆ == 1 && atlantic⁅i⁆⁅j⁆ == 1 {
                let mut pair: ArrayList<i64> = ArrayList::new(2)
                pair.push(i as i64)
                pair.push(j as i64)
                out.push(pair)
            }
            j = j + 1
        }
        i = i + 1
    }
    return out
}

class Solution {
    micro pacificAtlantic(self, heights: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return pacificAtlantic(heights)
    }
}
