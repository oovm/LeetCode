namespace leetcode.poor_pigs;

[export(case: "camelCase")]
micro poor_pigs(buckets: i64, minutesToDie: i64, minutesToTest: i64) -> i64 {
    let base: i64 = minutesToTest / minutesToDie + 1
    let mut res: i64 = 0
    let mut p: i64 = 1
    while p < buckets {
        p = p * base
        res = res + 1
    }
    return res
}

class Solution {
    micro poorPigs(self, buckets: i64, minutesToDie: i64, minutesToTest: i64): i64 {
        return poor_pigs(buckets, minutesToDie, minutesToTest)
    }
}
