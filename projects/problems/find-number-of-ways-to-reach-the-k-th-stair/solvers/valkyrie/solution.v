namespace leetcode.find_number_of_ways_to_reach_the_k_th_stair;

micro choose(n: i64, k: i64) -> i64 {
    if k < 0 || k > n {
        return 0
    }
    let mut result: i64 = 1
    let mut i: i64 = 1
    while i <= k {
        result = result * (n - i + 1) / i
        i = i + 1
    }
    return result
}

# 跳 j 次共升 2^j-1 级，下落 d=2^j-k 次须落进 j+1 个间隙且不连落：C(j+1, d)。
[export(case: "camelCase")]
micro ways_to_reach_stair(k: i64) -> i64 {
    let mut ways: i64 = 0
    let mut p: i64 = 1
    let mut j: i64 = 0
    while p <= k + j + 1 {
        let d: i64 = p - k
        if d >= 0 && d <= j + 1 {
            ways = ways + choose(j + 1, d)
        }
        p = p * 2
        j = j + 1
    }
    return ways
}

class Solution {
    micro waysToReachStair(self, k: i64): i64 {
        return ways_to_reach_stair(k)
    }
}
