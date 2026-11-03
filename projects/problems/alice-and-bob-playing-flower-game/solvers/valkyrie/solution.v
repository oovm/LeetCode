namespace leetcode.alice_and_bob_playing_flower_game;

# x+y 为奇数的对数：⌈n/2⌉·⌊m/2⌋ + ⌊n/2⌋·⌈m/2⌉。
[export(case: "camelCase")]
micro flower_game(n: i64, m: i64) -> i64 {
    return (n + 1) / 2 * (m / 2) + n / 2 * ((m + 1) / 2)
}

class Solution {
    micro flowerGame(self, n: i64, m: i64): i64 {
        return flower_game(n, m)
    }
}
