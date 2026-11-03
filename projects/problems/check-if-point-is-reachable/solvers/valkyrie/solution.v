namespace leetcode.check_if_point_is_reachable;

# 可达 iff gcd(x, y) 是 2 的幂（每次操作把坐标各乘/除 2 的因子可任意转移）。
[export(case: "camelCase")]
micro is_reachable(x: i64, y: i64) -> bool {
    let mut a: i64 = x
    let mut b: i64 = y
    while b != 0 {
        let t: i64 = a % b
        a = b
        b = t
    }
    return a.bit_and(a - 1) == 0
}

class Solution {
    micro isReachable(self, targetX: i64, targetY: i64): bool {
        return is_reachable(targetX, targetY)
    }
}
