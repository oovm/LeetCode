namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 岛屿形状 `IslandShape` 直接作 `BTreeSet` 键。
# `BTreeSet::insert` 声明 `where T: Equal`，实现体内部却裸调 `<`（`BTreeSet.v` L170 附近），
# 约束没有捕获它真正执行的操作。自定义键既需要 `Equal`（去重）也需要序关系（定位插入点）。
structure IslandShape {
    cells: ArrayList<i64>
}

imply IslandShape: std::operator::Equal {
    infix `==`(self, other: IslandShape): bool {
        if self.cells.length() != other.cells.length() {
            return false
        }
        let mut index: usize = 0
        while index < self.cells.length() {
            if self.cells⁅index⁆ != other.cells⁅index⁆ {
                return false
            }
            index = index + 1
        }
        return true
    }

    infix `!=`(self, other: IslandShape): bool {
        return !(self == other)
    }
}

# [提案] 顺序合同缺失：按相对坐标序列字典序比较。
imply IslandShape: std::operator::Comparable {
    infix `<`(self, other: IslandShape): bool {
        let mut index: usize = 0
        while index < self.cells.length() && index < other.cells.length() {
            if self.cells⁅index⁆ < other.cells⁅index⁆ {
                return true
            }
            if self.cells⁅index⁆ > other.cells⁅index⁆ {
                return false
            }
            index = index + 1
        }
        return self.cells.length() < other.cells.length()
    }
}

# 从扫描序首个格子出发做 BFS，相对坐标按固定邻序入队，同形状不同岛得到同一序列。
micro mark_island(grid: ArrayList<ArrayList<i64>>, start_row: usize, start_col: usize, cols: usize) -> IslandShape {
    let mut cells: ArrayList<i64> = ArrayList::new(64)
    let mut queue: Deque<i64> = Deque::new()
    queue.push_back((start_row * cols + start_col) as i64)
    grid⁅start_row⁆⁅start_col⁆ = 0

    while queue.length() > 0 {
        let cell: i64 = queue.pop_front().unwrap()
        let current_row: usize = (cell / (cols as i64)) as usize
        let current_col: usize = (cell % (cols as i64)) as usize
        let row_offset: i64 = (current_row as i64) - (start_row as i64)
        let col_offset: i64 = (current_col as i64) - (start_col as i64)
        cells.push(row_offset * 1000 + col_offset)

        if current_row > 0 && grid⁅current_row - 1⁆⁅current_col⁆ == 1 {
            grid⁅current_row - 1⁆⁅current_col⁆ = 0
            queue.push_back(((current_row - 1) * cols + current_col) as i64)
        }
        if current_row + 1 < grid.length() && grid⁅current_row + 1⁆⁅current_col⁆ == 1 {
            grid⁅current_row + 1⁆⁅current_col⁆ = 0
            queue.push_back(((current_row + 1) * cols + current_col) as i64)
        }
        if current_col > 0 && grid⁅current_row⁆⁅current_col - 1⁆ == 1 {
            grid⁅current_row⁆⁅current_col - 1⁆ = 0
            queue.push_back((current_row * cols + current_col - 1) as i64)
        }
        if current_col + 1 < cols && grid⁅current_row⁆⁅current_col + 1⁆ == 1 {
            grid⁅current_row⁆⁅current_col + 1⁆ = 0
            queue.push_back((current_row * cols + current_col + 1) as i64)
        }
    }
    return IslandShape { cells: cells }
}

class Solution {
    [export(case: "camelCase")]
    micro numDistinctIslands(grid: ArrayList<ArrayList<i64>>) -> i64 {
        let rows: usize = grid.length()
        if rows == 0 {
            return 0
        }
        let cols: usize = grid⁅0⁆.length()

        let mut shapes: BTreeSet<IslandShape> = BTreeSet::new()
        let mut row: usize = 0
        while row < rows {
            let mut col: usize = 0
            while col < cols {
                if grid⁅row⁆⁅col⁆ == 1 {
                    let shape: IslandShape = mark_island(grid, row, col, cols)
                    shapes.insert(shape)
                }
                col = col + 1
            }
            row = row + 1
        }
        return shapes.length() as i64
    }
}
