namespace leetcode.heaters;

using std.collection;
using std.math;

#  heater 排序后对每个 house 二分找最近 heater，取左右两邻距离较小者，再对全局取最大。
[export(case: "camelCase")]
micro findRadius(houses: [i64], heaters: [i64]) -> i64 {
    let mut sorted: ArrayList<i64> = ArrayList::new(heaters.length())
    loop value in heaters {
        sorted.push(value)
    }
    sort(sorted)
    let mut best: i64 = 0
    loop house in houses {
        let mut lo: usize = 0
        let mut hi: usize = sorted.length()
        while lo < hi {
            let mid: usize = (lo + hi) / 2
            if sorted⁅mid⁆ < house {
                lo = mid + 1
            } else {
                hi = mid
            }
        }
        # 距离恒非负，用 -1 表示「还没有候选」；不能用 0 当作缺省，
        # 否则 house 与某个 heater 重合时会把左侧较大距离覆盖回来。
        let mut radius: i64 = -1
        if lo < sorted.length() {
            radius = sorted⁅lo⁆ - house
        }
        if lo > 0 {
            let left: i64 = house - sorted⁅lo - 1⁆
            if radius < 0 || left < radius {
                radius = left
            }
        }
        if radius > best {
            best = radius
        }
    }
    return best
}

class Solution {
    micro findRadius(self, houses: [i64], heaters: [i64]): i64 {
        return findRadius(houses, heaters)
    }
}
