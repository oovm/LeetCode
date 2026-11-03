namespace leetcode.sum_of_numbers_with_units_digit_k;

# 最少个数 c：c·k ≡ num (mod 10) 且 c·k ≤ num；num=0 → 0，k=0 特判。
[export(case: "camelCase")]
micro minimum_numbers(num: i64, k: i64) -> i64 {
    if num == 0 {
        return 0
    }
    if k == 0 {
        if num % 10 == 0 {
            return 1
        }
        return -1
    }
    let mut c: i64 = 1
    while c <= 10 {
        if c * k % 10 == num % 10 && c * k <= num {
            return c
        }
        c = c + 1
    }
    return -1
}

class Solution {
    micro minimumNumbers(self, num: i64, k: i64): i64 {
        return minimum_numbers(num, k)
    }
}
