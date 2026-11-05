namespace leetcode.car_pooling;

using std.collection;

# 差分数组：每个上车点 +x、下车点 -x，再前缀累加判断是否超载。
[export(case: "camelCase")]
micro car_pooling(trips: ArrayList<ArrayList<i64>>, capacity: i64) -> bool {
    let mut farthest: i64 = 0
    let mut index: usize = 0
    while index < trips.length() {
        let drop: i64 = trips⁅index⁆⁅2⁆
        if drop > farthest {
            farthest = drop
        }
        index = index + 1
    }

    let mut changes: ArrayList<i64> = ArrayList::new((farthest + 1) as usize)
    let mut fill: i64 = 0
    while fill <= farthest {
        changes.push(0)
        fill = fill + 1
    }

    index = 0
    while index < trips.length() {
        let passengers: i64 = trips⁅index⁆⁅0⁆
        let pickup: i64 = trips⁅index⁆⁅1⁆
        let drop: i64 = trips⁅index⁆⁅2⁆
        changes⁅pickup as usize⁆ = changes⁅pickup as usize⁆ + passengers
        changes⁅drop as usize⁆ = changes⁅drop as usize⁆ - passengers
        index = index + 1
    }

    let mut onboard: i64 = 0
    let mut stop: i64 = 0
    while stop <= farthest {
        onboard = onboard + changes⁅stop as usize⁆
        if onboard > capacity {
            return false
        }
        stop = stop + 1
    }
    return true
}

class Solution {
    micro carPooling(self, trips: ArrayList<ArrayList<i64>>, capacity: i64): bool {
        return car_pooling(trips, capacity)
    }
}
