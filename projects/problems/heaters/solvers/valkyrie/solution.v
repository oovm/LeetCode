namespace leetcode.heaters;

using std.collection;
using std.math;

#  heater 排序后对每个 house 二分找最近 heater，取左右两邻距离较小者，再对全局取最大。
[export(case: "camelCase")]
micro findRadius(houses: ArrayList<i64>, heaters: ArrayList<i64>) -> i64 {
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
        let mut radius: i64 = 0
        if lo < sorted.length() {
            radius = sorted⁅lo⁆ - house
        }
        if lo > 0 {
            let left: i64 = house - sorted⁅lo - 1⁆
            if radius == 0 || left < radius {
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
    micro findRadius(self, houses: ArrayList<i64>, heaters: ArrayList<i64>): i64 {
        return findRadius(houses, heaters)
    }
}
