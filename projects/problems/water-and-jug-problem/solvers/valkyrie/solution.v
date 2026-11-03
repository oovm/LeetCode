namespace leetcode.water_and_jug_problem;

micro gcd(a: i64, b: i64) -> i64 {
    let mut x: i64 = a
    let mut y: i64 = b
    while y != 0 {
        let t: i64 = x % y
        x = y
        y = t
    }
    return x
}

# Bézout：可量出 ⟺ target ≤ x + y 且 target 是 gcd(x, y) 的倍数。
[export(case: "camelCase")]
micro can_measure_water(x: i64, y: i64, target: i64) -> bool {
    if target > x + y {
        return false
    }
    return target % gcd(x, y) == 0
}

class Solution {
    micro canMeasureWater(self, x: i64, y: i64, target: i64): bool {
        return can_measure_water(x, y, target)
    }
}
