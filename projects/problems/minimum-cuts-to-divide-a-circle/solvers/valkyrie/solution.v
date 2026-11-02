namespace leetcode.minimum_cuts_to_divide_a_circle;

[export(case: "camelCase")]
micro number_of_cuts(n: i64) -> i64 {
    if n == 1 {
        return 0
    }
    if n % 2 == 1 {
        return n
    }
    return n / 2
}

class Solution {
    micro numberOfCuts(self, n: i64): i64 {
        return number_of_cuts(n)
    }
}
