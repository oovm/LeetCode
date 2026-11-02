namespace leetcode.count_largest_group;

micro digit_sum(x: i64) -> i64 {
    let mut total: i64 = 0
    let mut rest: i64 = x
    while rest > 0 {
        total = total + rest % 10
        rest = rest / 10
    }
    return total
}

[export(case: "camelCase")]
micro count_largest_group(n: i64) -> i64 {
    let mut best_size: i64 = 0
    let mut best_count: i64 = 0
    let mut s: i64 = 1
    while s <= 36 {
        let mut size: i64 = 0
        let mut i: i64 = 1
        while i <= n {
            if digit_sum(i) == s {
                size = size + 1
            }
            i = i + 1
        }
        if size > best_size {
            best_size = size
            best_count = 1
        } else if size == best_size {
            best_count = best_count + 1
        }
        s = s + 1
    }
    return best_count
}

class Solution {
    micro countLargestGroup(self, n: i64): i64 {
        return count_largest_group(n)
    }
}
