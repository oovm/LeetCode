namespace leetcode.solution

using std.collection

# 题内触发点: BFS 状态是「格子 + 6 位钥匙掩码」；`BitSet(rows * cols * 64)` 作访问表，
# 容量由题面上界给出，不依赖 BitSet 自身报告长度（G25）。
class Solution {
    [export(case: "shortestPathAllKeys")]
    micro shortestPathAllKeys(grid: ArrayList<utf8>) -> i64 {
        let rows: i64 = grid.length() as i64
        let cols: i64 = grid⁅0⁆.byte_length() as i64
        let mut start_row: i64 = 0
        let mut start_col: i64 = 0
        let mut total_keys: i64 = 0
        let mut row: i64 = 0
        while row < rows {
            let mut col: i64 = 0
            while col < cols {
                let code: u8 = grid⁅row as usize⁆.byte_at(col as usize)
                if code == 64 {
                    start_row = row
                    start_col = col
                }
                if code >= 97 && code <= 102 {
                    total_keys = total_keys + 1
                }
                col = col + 1
            }
            row = row + 1
        }
        let all_keys: i64 = (1 as i64) << total_keys
        let visited: BitSet = BitSet::with_capacity((rows * cols * 64) as usize)
        let queue: Deque<i64> = Deque::new()
        let start_state: i64 = (start_row * cols + start_col) * 64
        visited.set(start_state as usize)
        queue.push_back(start_state)
        let delta_row: ArrayList<i64> = ArrayList::new(4)
        delta_row.push(0 - 1)
        delta_row.push(0)
        delta_row.push(1)
        delta_row.push(0)
        let delta_col: ArrayList<i64> = ArrayList::new(4)
        delta_col.push(0)
        delta_col.push(1)
        delta_col.push(0)
        delta_col.push(0 - 1)
        let mut steps: i64 = 0
        while queue.length() > 0 {
            let layer: usize = queue.length()
            let mut cursor: usize = 0
            while cursor < layer {
                let state: i64 = queue.pop_front().unwrap()
                let keys: i64 = state % 64
                let cell: i64 = state / 64
                let current_row: i64 = cell / cols
                let current_col: i64 = cell % cols
                if keys == all_keys - 1 {
                    return steps
                }
                let mut direction: i64 = 0
                while direction < 4 {
                    let next_row: i64 = current_row + delta_row⁅direction as usize⁆
                    let next_col: i64 = current_col + delta_col⁅direction as usize⁆
                    if next_row >= 0 && next_row < rows && next_col >= 0 && next_col < cols {
                        let code: u8 = grid⁅next_row as usize⁆.byte_at(next_col as usize)
                        if code != 35 {
                            let mut next_keys: i64 = keys
                            let mut allowed: bool = true
                            if code >= 97 && code <= 102 {
                                next_keys = keys | ((1 as i64) << ((code - 97) as i64))
                            }
                            if code >= 65 && code <= 70 {
                                let needed: i64 = (1 as i64) << ((code - 65) as i64)
                                if (keys & needed) == 0 {
                                    allowed = false
                                }
                            }
                            if allowed {
                                let next_state: i64 = (next_row * cols + next_col) * 64 + next_keys
                                if !visited.get(next_state as usize) {
                                    visited.set(next_state as usize)
                                    queue.push_back(next_state)
                                }
                            }
                        }
                    }
                    direction = direction + 1
                }
                cursor = cursor + 1
            }
            steps = steps + 1
        }
        return 0 - 1
    }
}
