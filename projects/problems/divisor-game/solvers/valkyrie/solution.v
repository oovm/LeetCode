namespace leetcode.divisor_game;

[export(case: "camelCase")]
micro divisor_game(n: i64) -> bool {
    return n % 2 == 0
}

class Solution {
    micro divisorGame(self, n: i64): bool {
        return divisor_game(n)
    }
}
