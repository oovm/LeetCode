namespace leetcode.taking_maximum_energy_from_the_mystic_dungeon;

using std.collection;

# 后缀和按模 `k` 分组：从右往左累加同一余数链路的能量。
# 每个起点对应一条「每步跳 `k` 格」的后缀链。
[export(case: "camelCase")]
micro maximumEnergy(energy: ArrayList<i64>, k: i64) -> i64 {
    let length: usize = energy.length()
    let step: usize = k as usize
    let mut suffix: ArrayList<i64> = ArrayList::new(length)
    let mut fill: usize = 0
    while fill < length {
        suffix.push(0)
        fill = fill + 1
    }

    let mut index: usize = length
    while index > 0 {
        let position: usize = index - 1
        let mut value: i64 = energy⁅position⁆
        if position + step < length {
            value = value + suffix⁅position + step⁆
        }
        suffix.set((position + 1) as isize, value)
        index = index - 1
    }

    let mut best: i64 = suffix⁅0⁆
    let mut scan: usize = 1
    while scan < length {
        if suffix⁅scan⁆ > best {
            best = suffix⁅scan⁆
        }
        scan = scan + 1
    }
    return best
}

class Solution {
    micro maximumEnergy(self, energy: ArrayList<i64>, k: i64): i64 {
        return maximumEnergy(energy, k)
    }
}
