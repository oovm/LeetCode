namespace leetcode.largest_number_after_digit_swaps_by_parity;

micro pow10(k: i64) -> i64 {
    let mut r: i64 = 1
    let mut i: i64 = 0
    while i < k {
        r = r * 10
        i = i + 1
    }
    return r
}

micro pow16(k: i64) -> i64 {
    let mut r: i64 = 1
    let mut i: i64 = 0
    while i < k {
        r = r * 16
        i = i + 1
    }
    return r
}

# 无限次同奇偶交换：奇偶两组各自降序重排。V 无可用数组，把各数字值的计数
# 打包进 i64 的 4-bit 槽位（计数排序），按位取出最大者重建。
[export(case: "camelCase")]
micro largest_integer(num: i64) -> i64 {
    let mut len: i64 = 0
    let mut t: i64 = num
    while t > 0 {
        len = len + 1
        t = t / 10
    }
    let mut evens: i64 = 0
    let mut odds: i64 = 0
    t = num
    while t > 0 {
        let d: i64 = t % 10
        if d % 2 == 0 {
            evens = evens + pow16(d)
        } else {
            odds = odds + pow16(d)
        }
        t = t / 10
    }
    let mut result: i64 = 0
    let mut pos: i64 = len - 1
    while pos >= 0 {
        let digit: i64 = (num / pow10(pos)) % 10
        let parity: i64 = digit % 2
        if parity == 0 {
            let mut v: i64 = 8
            let mut done: bool = false
            while v >= 0 && done == false {
                if (evens / pow16(v)) % 16 > 0 {
                    result = result * 10 + v
                    evens = evens - pow16(v)
                    done = true
                }
                v = v - 2
            }
        } else {
            let mut v: i64 = 9
            let mut done: bool = false
            while v >= 1 && done == false {
                if (odds / pow16(v)) % 16 > 0 {
                    result = result * 10 + v
                    odds = odds - pow16(v)
                    done = true
                }
                v = v - 2
            }
        }
        pos = pos - 1
    }
    return result
}

class Solution {
    micro largestInteger(self, num: i64): i64 {
        return largest_integer(num)
    }
}
