namespace leetcode.count_ways_to_distribute_candies;

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

# 第二类 Stirling：S(n,k) = (1/k!)·Σ (-1)^i·C(k,i)·(k-i)^n，组合数递推配费马逆元。
[export(case: "camelCase")]
micro ways_to_distribute(n: i64, k: i64) -> i64 {
    let mut sum: i64 = 0
    let mut cki: i64 = 1
    let mut i: i64 = 0
    while i <= k {
        let term: i64 = cki * mod_pow(k - i, n) % 1000000007
        if i % 2 == 0 {
            sum = (sum + term) % 1000000007
        } else {
            sum = (sum + 1000000007 - term) % 1000000007
        }
        cki = cki * (k - i) % 1000000007 * mod_pow(i + 1, 1000000005) % 1000000007
        i = i + 1
    }
    let mut fact: i64 = 1
    let mut j: i64 = 2
    while j <= k {
        fact = fact * j % 1000000007
        j = j + 1
    }
    return sum * mod_pow(fact, 1000000005) % 1000000007
}

class Solution {
    micro waysToDistribute(self, n: i64, k: i64): i64 {
        return ways_to_distribute(n, k)
    }
}
