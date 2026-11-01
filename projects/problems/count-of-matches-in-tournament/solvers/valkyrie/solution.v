namespace leetcode.count_of_matches_in_tournament;

[export(case: "camelCase")]
micro number_of_matches(n: i64) -> i64 {
    return n - 1
}

class Solution {
    micro numberOfMatches(self, n: i64): i64 {
        return number_of_matches(n)
    }
}
