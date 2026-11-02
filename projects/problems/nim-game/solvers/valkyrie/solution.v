namespace leetcode.nim_game;

[export(case: "camelCase")]
micro can_win_nim(n: i64) -> bool {
    return n % 4 != 0
}

class Solution {
    micro canWinNim(self, n: i64): bool {
        return can_win_nim(n)
    }
}
