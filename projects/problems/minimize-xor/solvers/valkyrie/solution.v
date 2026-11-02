namespace leetcode.minimize_xor;

micro bit_count_of(x: i64) -> i64 {
    let mut count: i64 = 0
    let mut num: i64 = x
    while num > 0 {
        if num % 2 == 1 {
            count = count + 1
        }
        num = num / 2
    }
    return count
}

micro bit_at(x: i64, i: i64) -> i64 {
    let mut base: i64 = 1
    let mut j: i64 = 0
    while j < i {
        base = base * 2
        j = j + 1
    }
    return x / base % 2
}

micro set_bit(x: i64, i: i64) -> i64 {
    let mut base: i64 = 1
    let mut j: i64 = 0
    while j < i {
        base = base * 2
        j = j + 1
    }
    return x + base
}

[export(case: "camelCase")]
micro minimize_xor(num1: i64, num2: i64) -> i64 {
    let mut cnt: i64 = bit_count_of(num2)
    let mut x: i64 = 0
    let mut i: i64 = 30
    while i >= 0 {
        if cnt > 0 && bit_at(num1, i) == 1 {
            x = set_bit(x, i)
            cnt = cnt - 1
        }
        i = i - 1
    }
    i = 0
    while i < 30 {
        if cnt > 0 && bit_at(num1, i) == 0 {
            x = set_bit(x, i)
            cnt = cnt - 1
        }
        i = i + 1
    }
    return x
}

class Solution {
    micro minimizeXor(self, num1: i64, num2: i64): i64 {
        return minimize_xor(num1, num2)
    }
}
