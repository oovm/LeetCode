namespace leetcode.distribute_candies_among_children_i;

# 隔板法 + 容斥：a+b+c=n 且每个 ≤ limit。
# 总数 C(n+2,2)，减去某孩子 ≥ limit+1 的 3·C(n-(limit+1)+2,2)，
# 加回两孩子同时超限的 3·C(n-2(limit+1)+2,2)，再减三孩子全超限的 C(n-3(limit+1)+2,2)。
micro choose2(m: i64) -> i64 {
    if m < 2 {
        return 0
    }
    return m * (m - 1) / 2
}

[export(case: "camelCase")]
micro distribute_candies(n: i64, limit: i64) -> i64 {
    let over: i64 = limit + 1
    return choose2(n + 2) - 3 * choose2(n - over + 2) + 3 * choose2(n - 2 * over + 2) - choose2(n - 3 * over + 2)
}

class Solution {
    micro distributeCandies(self, n: i64, limit: i64): i64 {
        return distribute_candies(n, limit)
    }
}
