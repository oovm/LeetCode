namespace leetcode.stone_removal_game;

[export(case: "camelCase")]
micro can_alice_win(n: i64) -> bool {
    let mut remaining: i64 = n
    let mut x: i64 = 10
    let mut k: i64 = 0
    while remaining >= x {
        remaining = remaining - x
        x = x - 1
        k = k + 1
    }
    return k % 2 == 1
}

class Solution {
    micro canAliceWin(self, n: i64): bool {
        return can_alice_win(n)
    }
}
