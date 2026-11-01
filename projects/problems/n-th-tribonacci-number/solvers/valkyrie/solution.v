namespace leetcode.n_th_tribonacci_number;

[export(case: "camelCase")]
micro tribonacci(n: i64) -> i64 {
    if n == 0 {
        return 0
    }
    if n == 1 {
        return 1
    }
    if n == 2 {
        return 1
    }
    let mut older: i64 = 0
    let mut middle: i64 = 1
    let mut recent: i64 = 1
    let mut step: i64 = 3
    while step <= n {
        let upcoming: i64 = older + middle + recent
        older = middle
        middle = recent
        recent = upcoming
        step = step + 1
    }
    return recent
}

class Solution {
    micro tribonacci(self, n: i64): i64 {
        return tribonacci(n)
    }
}
