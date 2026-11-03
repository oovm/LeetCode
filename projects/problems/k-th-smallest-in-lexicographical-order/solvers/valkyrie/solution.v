namespace leetcode.k_th_smallest_in_lexicographical_order;

micro min_of(a: i64, b: i64) -> i64 {
    if a < b {
        return a
    }
    return b
}

# 字典序前缀子树的节点数：逐层 [first, next) 截到 n+1。
micro count_with_prefix(n: i64, prefix: i64) -> i64 {
    let mut total: i64 = 0
    let mut first: i64 = prefix
    let mut next: i64 = prefix + 1
    while first <= n {
        total = total + min_of(n + 1, next) - first
        first = first * 10
        next = next * 10
    }
    return total
}

[export(case: "camelCase")]
micro find_kth_number(n: i64, k: i64) -> i64 {
    let mut current: i64 = 1
    let mut rest: i64 = k - 1
    while rest > 0 {
        let steps: i64 = count_with_prefix(n, current)
        if steps <= rest {
            rest = rest - steps
            current = current + 1
        } else {
            rest = rest - 1
            current = current * 10
        }
    }
    return current
}

class Solution {
    micro findKthNumber(self, n: i64, k: i64): i64 {
        return find_kth_number(n, k)
    }
}
