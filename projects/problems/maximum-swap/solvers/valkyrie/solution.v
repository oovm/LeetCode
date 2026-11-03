namespace leetcode.maximum_swap;

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

# 高位到低位的首个位 i：右侧最右出现的最大且更大的数字与其交换，一次即止。
[export(case: "camelCase")]
micro maximum_swap(num: i64) -> i64 {
    let digits: i64 = digit_count(num)
    let mut i: i64 = 0
    while i < digits {
        let pi: i64 = digits - 1 - i
        let di: i64 = digit_at(num, pi)
        let mut best_d: i64 = di
        let mut best_p: i64 = -1
        let mut j: i64 = digits - 1
        while j > i {
            let pj: i64 = digits - 1 - j
            let dj: i64 = digit_at(num, pj)
            if dj > best_d {
                best_d = dj
                best_p = pj
            }
            j = j - 1
        }
        if best_p >= 0 {
            return num + (best_d - di) * pow10(pi) + (di - best_d) * pow10(best_p)
        }
        i = i + 1
    }
    return num
}

class Solution {
    micro maximumSwap(self, num: i64): i64 {
        return maximum_swap(num)
    }
}
