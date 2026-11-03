namespace leetcode.determine_if_a_cell_is_reachable_at_a_given_time;

micro abs_i64(x: i64) -> i64 {
    if x < 0 {
        return 0 - x
    }
    return x
}

# Chebyshev 距离 ≤ t 即可达；原地不动（起终同点）时 t=1 不可达。
[export(case: "camelCase")]
micro is_reachable_at_time(sx: i64, sy: i64, fx: i64, fy: i64, t: i64) -> bool {
    if sx == fx && sy == fy {
        return t != 1
    }
    let dx: i64 = abs_i64(sx - fx)
    let dy: i64 = abs_i64(sy - fy)
    let mut dist: i64 = dx
    if dy > dx {
        dist = dy
    }
    return dist <= t
}

class Solution {
    micro isReachableAtTime(self, sx: i64, sy: i64, fx: i64, fy: i64, t: i64): bool {
        return is_reachable_at_time(sx, sy, fx, fy, t)
    }
}
