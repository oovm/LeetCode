namespace leetcode.flower_planting_with_no_adjacent;

using std.collection;

# 贪心 4 染色：建无向邻接表，按编号顺序给每个花园取邻接已用颜色之外的最小颜色。
[export(case: "camelCase")]
micro gardenNoAdj(n: i64, paths: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let count: usize = n as usize

    let mut adjacency: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        let mut row: ArrayList<i64> = ArrayList::new(0)
        adjacency.push(row)
        fill = fill + 1
    }

    let mut index: usize = 0
    while index < paths.length() {
        let path: ArrayList<i64> = paths⁅index⁆
        let left: i64 = path⁅0⁆ - 1
        let right: i64 = path⁅1⁆ - 1

        let mut left_links: ArrayList<i64> = adjacency⁅left as usize⁆
        left_links.push(right)
        adjacency.set((left + 1) as isize, left_links)

        let mut right_links: ArrayList<i64> = adjacency⁅right as usize⁆
        right_links.push(left)
        adjacency.set((right + 1) as isize, right_links)

        index = index + 1
    }

    let mut colors: ArrayList<i64> = ArrayList::new(count)
    fill = 0
    while fill < count {
        colors.push(0)
        fill = fill + 1
    }

    let mut garden: usize = 0
    while garden < count {
        let links: ArrayList<i64> = adjacency⁅garden⁆
        let mut color: i64 = 1
        let mut chosen: i64 = 0
        while color <= 4 && chosen == 0 {
            let mut available: bool = true
            let mut cursor: usize = 0
            while cursor < links.length() {
                let neighbor: i64 = links⁅cursor⁆
                if colors⁅neighbor as usize⁆ == color {
                    available = false
                }
                cursor = cursor + 1
            }
            if available {
                chosen = color
            }
            color = color + 1
        }
        colors.set(((garden as i64) + 1) as isize, chosen)
        garden = garden + 1
    }

    return colors
}

class Solution {
    micro gardenNoAdj(self, n: i64, paths: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return gardenNoAdj(n, paths)
    }
}
