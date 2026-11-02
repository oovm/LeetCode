namespace leetcode.unique_paths;

[export(case: "camelCase")]
micro unique_paths(m: i64, n: i64) -> i64 {
    let mut k: i64 = m - 1
    if n - 1 < k {
        k = n - 1
    }
    let total: i64 = m + n - 2
    let mut result: i64 = 1
    let mut i: i64 = 1
    while i <= k {
        result = result * (total - k + i) / i
        i = i + 1
    }
    return result
}

class Solution {
    micro uniquePaths(self, m: i64, n: i64): i64 {
        return unique_paths(m, n)
    }
}
