namespace leetcode.smallest_divisible_digit_product_i;

micro digit_product(x: i64) -> i64 {
    let mut product: i64 = 1
    let mut rest: i64 = x
    while rest > 0 {
        product = product * (rest % 10)
        rest = rest / 10
    }
    return product
}

[export(case: "camelCase")]
micro smallest_number(n: i64, t: i64) -> i64 {
    let mut x: i64 = n
    while digit_product(x) % t != 0 {
        x = x + 1
    }
    return x
}

class Solution {
    micro smallestNumber(self, n: i64, t: i64): i64 {
        return smallest_number(n, t)
    }
}
