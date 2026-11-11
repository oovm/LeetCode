namespace leetcode.one_one_matrix;

using std.collection;

# 多源 BFS：所有 0 格入队距离 0，四邻逐层松弛；每格至多入队一次，O(mn)。
[export(case: "camelCase")]
micro updateMatrix(mat: [[i64]]) -> [[i64]] {
    let rows: usize = mat.length()
    let cols: usize = mat⁅0⁆.length()
    let mut dist: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut queue: ArrayList<i64> = ArrayList::new(0)
    let mut i: usize = 0
    while i < rows {
        let mut row: ArrayList<i64> = ArrayList::new(cols)
        let mut j: usize = 0
        while j < cols {
            if mat⁅i⁆⁅j⁆ == 0 {
                row.push(0)
                queue.push(i as i64 * cols as i64 + j as i64)
            } else {
                row.push(-1)
            }
            j = j + 1
        }
        dist.push(row)
        i = i + 1
    }
    let mut head: usize = 0
    while head < queue.length() {
        let cell: i64 = queue⁅head⁆
        let r: usize = (cell / cols as i64) as usize
        let c: usize = (cell % cols as i64) as usize
        head = head + 1
        let base: i64 = dist⁅r⁆⁅c⁆
        if r > 0 && dist⁅r - 1⁆⁅c⁆ == -1 {
            dist⁅r - 1⁆⁅c⁆ = base + 1
            queue.push((r - 1) as i64 * cols as i64 + c as i64)
        }
        if r + 1 < rows && dist⁅r + 1⁆⁅c⁆ == -1 {
            dist⁅r + 1⁆⁅c⁆ = base + 1
            queue.push((r + 1) as i64 * cols as i64 + c as i64)
        }
        if c > 0 && dist⁅r⁆⁅c - 1⁆ == -1 {
            dist⁅r⁆⁅c - 1⁆ = base + 1
            queue.push(r as i64 * cols as i64 + (c - 1) as i64)
        }
        if c + 1 < cols && dist⁅r⁆⁅c + 1⁆ == -1 {
            dist⁅r⁆⁅c + 1⁆ = base + 1
            queue.push(r as i64 * cols as i64 + (c + 1) as i64)
        }
    }
    let mut frozen: ArrayList<[i64]> = ArrayList::new(rows)
    let mut freeze_cursor: usize = 0
    while freeze_cursor < rows {
        frozen.push(dist⁅freeze_cursor⁆.to_array())
        freeze_cursor = freeze_cursor + 1
    }
    return frozen.to_array()
}

class Solution {
    micro updateMatrix(self, mat: [[i64]]): [[i64]] {
        return updateMatrix(mat)
    }
}
