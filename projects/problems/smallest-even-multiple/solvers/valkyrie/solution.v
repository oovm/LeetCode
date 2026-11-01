namespace leetcode.smallest_even_multiple;

[export(case: "camelCase")]
micro smallest_even_multiple(n: i64) -> i64 {
    if n % 2 == 0 {
        return n
    }
    return n * 2
}

class Solution {
    micro smallestEvenMultiple(self, n: i64): i64 {
        return smallest_even_multiple(n)
    }
}
