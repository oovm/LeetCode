namespace leetcode.range_addition;

using std.collection;

# 差分数组：区间加只在 `[l] += v`、`[r+1] -= v` 打点，前缀和还原即最终数组。
[export(case: "camelCase")]
micro getModifiedArray(length: i64, updates: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let n: usize = length as usize
    let mut diff: ArrayList<i64> = ArrayList::new(n)
    let mut slot: usize = 0
    while slot < n {
        diff.push(0)
        slot = slot + 1
    }
    loop update in updates {
        diff⁅update⁅0⁆ as usize⁆ = diff⁅update⁅0⁆ as usize⁆ + update⁅2⁆
        if update⁅1⁆ + 1 < length {
            diff⁅(update⁅1⁆ + 1) as usize⁆ = diff⁅(update⁅1⁆ + 1) as usize⁆ - update⁅2⁆
        }
    }
    let mut out: ArrayList<i64> = ArrayList::new(n)
    let mut running: i64 = 0
    slot = 0
    while slot < n {
        running = running + diff⁅slot⁆
        out.push(running)
        slot = slot + 1
    }
    return out
}

class Solution {
    micro getModifiedArray(self, length: i64, updates: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return getModifiedArray(length, updates)
    }
}
