namespace leetcode.number_of_strings_which_can_be_rearranged_to_contain_substring;

micro mod_pow(base: i64, exp: i64) -> i64 {
    let mut result: i64 = 1
    let mut b: i64 = base % 1000000007
    let mut e: i64 = exp
    while e > 0 {
        if e % 2 == 1 {
            result = result * b % 1000000007
        }
        b = b * b % 1000000007
        e = e / 2
    }
    return result
}

# 含 ≥1 l、≥2 e、≥1 t 的重排计数：容斥
# 26^n - 3·25^n - n·25^(n-1) + 3·24^n + 2n·24^(n-1) - 23^n - n·23^(n-1)。
[export(case: "camelCase")]
micro string_count(n: i64) -> i64 {
    let m: i64 = 1000000007
    let mut total: i64 = mod_pow(26, n)
    total = (total + m - 3 * mod_pow(25, n) % m) % m
    total = (total + m - n % m * mod_pow(25, n - 1) % m) % m
    total = (total + 3 * mod_pow(24, n) % m) % m
    total = (total + 2 * (n % m) % m * mod_pow(24, n - 1) % m) % m
    total = (total + m - mod_pow(23, n)) % m
    total = (total + m - n % m * mod_pow(23, n - 1) % m) % m
    return total
}

class Solution {
    micro stringCount(self, n: i64): i64 {
        return string_count(n)
    }
}
