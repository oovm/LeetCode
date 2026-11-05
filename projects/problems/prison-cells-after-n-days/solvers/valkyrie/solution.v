namespace leetcode.prison_cells_after_n_days;

using std.collection;

# 只有 8 个格子，状态数最多 256，必在有限步进入循环。
# 用哈希记录首次出现的步号，跳过整段循环，O(1) 级别。
micro encode(cells: ArrayList<i64>) -> i64 {
    let mut state: i64 = 0
    let mut i: usize = 0
    while i < 8 {
        state = state * 2 + cells⁅i⁆
        i = i + 1
    }
    return state
}

micro decode(state: i64) -> ArrayList<i64> {
    let mut cells: ArrayList<i64> = ArrayList::new(8)
    let mut i: usize = 0
    while i < 8 {
        cells.push(0)
        i = i + 1
    }
    let mut rest: i64 = state
    let mut k: i64 = 7
    while k >= 0 {
        cells⁅k as usize⁆ = rest % 2
        rest = rest / 2
        k = k - 1
    }
    return cells
}

micro advance(state: i64) -> i64 {
    let cells: ArrayList<i64> = decode(state)
    let mut result: i64 = 0
    let mut i: i64 = 0
    while i < 8 {
        let mut bit: i64 = 0
        if i >= 1 && i <= 6 {
            if cells⁅(i - 1) as usize⁆ == cells⁅(i + 1) as usize⁆ {
                bit = 1
            }
        }
        result = result * 2 + bit
        i = i + 1
    }
    return result
}

[export(case: "camelCase")]
micro prisonAfterNDays(cells: ArrayList<i64>, n: i64) -> ArrayList<i64> {
    let mut state: i64 = encode(cells)
    let mut seen: HashMap<i64, i64> = HashMap::new(0)
    let mut step: i64 = 0
    while step < n {
        if seen.contains_key(state) {
            let cycle: i64 = step - seen.get(state).unwrap()
            let remain: i64 = (n - step) % cycle
            let mut r: i64 = 0
            while r < remain {
                state = advance(state)
                r = r + 1
            }
            step = n
            break
        }
        seen.insert(state, step)
        state = advance(state)
        step = step + 1
    }
    return decode(state)
}

class Solution {
    micro prisonAfterNDays(self, cells: ArrayList<i64>, n: i64): ArrayList<i64> {
        return prisonAfterNDays(cells, n)
    }
}
