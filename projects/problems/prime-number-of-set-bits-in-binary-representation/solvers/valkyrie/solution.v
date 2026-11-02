namespace leetcode.prime_number_of_set_bits_in_binary_representation;

micro is_small_prime(n: i64) -> bool {
    if n == 2 || n == 3 || n == 5 || n == 7 {
        return true
    }
    if n == 11 || n == 13 || n == 17 || n == 19 {
        return true
    }
    if n == 23 || n == 29 || n == 31 {
        return true
    }
    return false
}

micro popcount(v: i64) -> i64 {
    let mut c: i64 = 0
    let mut value: i64 = v
    while value > 0 {
        c = c + value.bit_and(1)
        value = value.bit_shift_right(1)
    }
    return c
}

[export(case: "camelCase")]
micro count_prime_set_bits(left: i64, right: i64) -> i64 {
    let mut count: i64 = 0
    let mut v: i64 = left
    while v <= right {
        if is_small_prime(popcount(v)) {
            count = count + 1
        }
        v = v + 1
    }
    return count
}

class Solution {
    micro countPrimeSetBits(self, left: i64, right: i64): i64 {
        return count_prime_set_bits(left, right)
    }
}
