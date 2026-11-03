namespace leetcode.minimum_cost_to_set_cooking_time;

micro pow10(p: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 0
    while i < p {
        result = result * 10
        i = i + 1
    }
    return result
}

micro digit_count(x: i64) -> i64 {
    let mut count: i64 = 0
    let mut rest: i64 = x
    while rest > 0 {
        count = count + 1
        rest = rest / 10
    }
    return count
}

micro digit_at(x: i64, p: i64) -> i64 {
    return (x / pow10(p)) % 10
}

# 显示为 m 的十进制（无前导零）后接 s 的两位零填充，逐位计价。
micro cost_of(m: i64, s: i64, start_at: i64, move_cost: i64, push_cost: i64) -> i64 {
    let mut cost: i64 = 0
    let mut prev: i64 = start_at
    let dm: i64 = digit_count(m)
    let mut p: i64 = dm - 1
    while p >= 0 {
        let d: i64 = digit_at(m, p)
        if d != prev {
            cost = cost + move_cost
        }
        cost = cost + push_cost
        prev = d
        p = p - 1
    }
    let mut q: i64 = 1
    while q >= 0 {
        let d: i64 = digit_at(s, q)
        if d != prev {
            cost = cost + move_cost
        }
        cost = cost + push_cost
        prev = d
        q = q - 1
    }
    return cost
}

[export(case: "camelCase")]
micro min_cost_set_time(startAt: i64, moveCost: i64, pushCost: i64, targetSeconds: i64) -> i64 {
    let mut best: i64 = 9223372036854775807
    let mut m: i64 = 0
    while m <= 99 {
        let s: i64 = targetSeconds - 60 * m
        if s >= 0 && s <= 99 {
            let c: i64 = cost_of(m, s, startAt, moveCost, pushCost)
            if c < best {
                best = c
            }
        }
        m = m + 1
    }
    return best
}

class Solution {
    micro minCostSetTime(self, startAt: i64, moveCost: i64, pushCost: i64, targetSeconds: i64): i64 {
        return min_cost_set_time(startAt, moveCost, pushCost, targetSeconds)
    }
}
