namespace leetcode.minimum_factorization;

# 贪心分解 9..2，因子升序重建；剩余 > 1 或超 i32 则 0。
[export(case: "camelCase")]
micro smallest_factorization(num: i64) -> i64 {
    if num < 2 {
        return num
    }
    let mut rest: i64 = num
    let mut answer: i64 = 0
    let mut place: i64 = 1
    let mut digits: i64 = 0
    let mut d: i64 = 9
    while d >= 2 {
        while rest % d == 0 {
            answer = answer + d * place
            place = place * 10
            digits = digits + 1
            rest = rest / d
        }
        d = d - 1
    }
    if rest > 1 || digits > 10 || answer > 2147483647 {
        return 0
    }
    return answer
}

class Solution {
    micro smallestFactorization(self, num: i64): i64 {
        return smallest_factorization(num)
    }
}
