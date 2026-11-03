namespace leetcode.total_distance_traveled;

# 模拟：主油箱每耗 5 升且副油箱非空即补 1 升，里程每升 10 公里。
[export(case: "camelCase")]
micro distance_traveled(mainTank: i64, additionalTank: i64) -> i64 {
    let mut main: i64 = mainTank
    let mut extra: i64 = additionalTank
    let mut used: i64 = 0
    let mut distance: i64 = 0
    while main > 0 {
        main = main - 1
        used = used + 1
        distance = distance + 10
        if used == 5 {
            used = 0
            if extra > 0 {
                extra = extra - 1
                main = main + 1
            }
        }
    }
    return distance
}

class Solution {
    micro distanceTraveled(self, mainTank: i64, additionalTank: i64): i64 {
        return distance_traveled(mainTank, additionalTank)
    }
}
