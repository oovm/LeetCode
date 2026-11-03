namespace leetcode.distribute_candies_among_children_iii;

micro c2(x: i64) -> i64 {
    if x < 2 {
        return 0
    }
    return x * (x - 1) / 2
}

# 容斥：Σ (-1)^i·C(3,i)·C(n-i·(limit+1)+2, 2)。
[export(case: "camelCase")]
micro distribute_candies(n: i64, limit: i64) -> i64 {
    return c2(n + 2) - 3 * c2(n - limit + 1) + 3 * c2(n - 2 * limit) - c2(n - 3 * limit - 1)
}

class Solution {
    micro distributeCandies(self, n: i64, limit: i64): i64 {
        return distribute_candies(n, limit)
    }
}
