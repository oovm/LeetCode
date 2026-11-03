namespace leetcode.distribute_candies_among_children_ii;

micro choose2(m: i64) -> i64 {
    if m < 2 {
        return 0
    }
    return m * (m - 1) / 2
}

# 与 I 同式，约束放大后仍是同一条容斥（i64 全程精确）。
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
