namespace leetcode.next_greater_element_iii;

micro pow10(p: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 0
    while i < p {
        result = result * 10
        i = i + 1
    }
    return result
}

micro digit_at(x: i64, p: i64) -> i64 {
    return (x / pow10(p)) % 10
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

# 纯算术下一排列：枢轴=从低位起首个「高位 < 右邻」的位；交换 + 反转低位段。
[export(case: "camelCase")]
micro next_greater_element(n: i64) -> i64 {
    let digits: i64 = digit_count(n)
    let mut p: i64 = 1
    while p < digits && digit_at(n, p) >= digit_at(n, p - 1) {
        p = p + 1
    }
    if p == digits {
        return -1
    }
    let pivot_digit: i64 = digit_at(n, p)
    # 低位段（0..p-1）中大于枢轴的最小数字，取最靠右者。
    let mut q: i64 = 0
    let mut best: i64 = 10
    let mut i: i64 = 0
    while i < p {
        let d: i64 = digit_at(n, i)
        if d > pivot_digit && d < best {
            best = d
            q = i
        }
        i = i + 1
    }
    let swapped: i64 = n + (best - pivot_digit) * pow10(p) + (pivot_digit - best) * pow10(q)
    # 低位段从低位到高位非升，反转后从高到低非升（最小后缀）。
    let mut rebuilt: i64 = swapped / pow10(p) * pow10(p)
    let mut k: i64 = 0
    while k < p {
        rebuilt = rebuilt + digit_at(swapped, k) * pow10(p - 1 - k)
        k = k + 1
    }
    # 题面 32 位整数上界。
    if rebuilt > 2147483647 {
        return -1
    }
    return rebuilt
}

class Solution {
    micro nextGreaterElement(self, n: i64): i64 {
        return next_greater_element(n)
    }
}
