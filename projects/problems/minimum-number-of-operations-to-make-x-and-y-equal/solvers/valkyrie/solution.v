namespace leetcode.minimum_number_of_operations_to_make_x_and_y_equal;

micro solve(current: i64, target: i64, memo: ArrayList<i64>) -> i64 {
    if current <= target {
        return target - current
    }
    let index: usize = current as usize
    let cached: i64 = memo⁅index⁆
    if cached >= 0 {
        return cached
    }
    let mut best: i64 = current - target
    let mut divisor: i64 = 5
    while divisor <= 11 {
        let remainder: i64 = current % divisor
        let down: i64 = 1 + remainder + solve(current / divisor, target, memo)
        if down < best {
            best = down
        }
        let mut quotient: i64 = current / divisor
        if remainder != 0 {
            quotient = quotient + 1
        }
        let up: i64 = 1 + (divisor - remainder) + solve(quotient, target, memo)
        if up < best {
            best = up
        }
        if divisor == 5 {
            divisor = 11
        } else {
            divisor = 12
        }
    }
    memo⁅index⁆ = best
    return best
}

[export(case: "camelCase")]
micro minimumOperationsToMakeEqual(x: i64, y: i64) -> i64 {
    let mut memo: ArrayList<i64> = ArrayList::new(10001)
    let mut slot: i64 = 0
    while slot <= 10000 {
        memo.push(-1)
        slot = slot + 1
    }
    return solve(x, y, memo)
}

class Solution {
    micro minimumOperationsToMakeEqual(self, x: i64, y: i64): i64 {
        return minimumOperationsToMakeEqual(x, y)
    }
}
