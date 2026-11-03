namespace leetcode.max_difference_you_can_get_from_changing_an_integer;

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

# 把所有 from 位改写成 to，纯数值重建。
micro remap(num: i64, from: i64, to: i64) -> i64 {
    let digits: i64 = digit_count(num)
    let mut result: i64 = 0
    let mut p: i64 = digits - 1
    while p >= 0 {
        let d: i64 = digit_at(num, p)
        if d == from {
            result = result * 10 + to
        } else {
            result = result * 10 + d
        }
        p = p - 1
    }
    return result
}

# 最大：最高非 9 位改 9。最小：首位非 1 改 1，否则最高大于 1 的位改 0。
[export(case: "camelCase")]
micro max_diff(num: i64) -> i64 {
    let digits: i64 = digit_count(num)
    let mut d_max: i64 = -1
    let mut i: i64 = 0
    while i < digits {
        let d: i64 = digit_at(num, digits - 1 - i)
        if d != 9 && d_max < 0 {
            d_max = d
        }
        i = i + 1
    }
    let mut max_v: i64 = num
    if d_max >= 0 {
        max_v = remap(num, d_max, 9)
    }
    let first: i64 = digit_at(num, digits - 1)
    let mut min_v: i64 = num
    if first != 1 {
        min_v = remap(num, first, 1)
    } else {
        let mut d_min: i64 = -1
        let mut j: i64 = 0
        while j < digits {
            let d: i64 = digit_at(num, digits - 1 - j)
            if d > 1 && d_min < 0 {
                d_min = d
            }
            j = j + 1
        }
        if d_min >= 0 {
            min_v = remap(num, d_min, 0)
        }
    }
    return max_v - min_v
}

class Solution {
    micro maxDiff(self, num: i64): i64 {
        return max_diff(num)
    }
}
