namespace leetcode.find_the_winner_of_an_array_game;

using std.collection;

# 每个元素只会作为挑战者出现一次，连续胜场达到 k 就结束，O(n)。
[export(case: "camelCase")]
micro getWinner(arr: [i64], k: i64) -> i64 {
    let mut winner: i64 = arr⁅0⁆
    let mut wins: i64 = 0
    let mut i: usize = 1
    while i < arr.length() {
        let challenger: i64 = arr⁅i⁆
        if challenger > winner {
            winner = challenger
            wins = 1
        } else {
            wins = wins + 1
        }
        if wins >= k {
            return winner
        }
        i = i + 1
    }
    return winner
}

class Solution {
    micro getWinner(self, arr: [i64], k: i64): i64 {
        return getWinner(arr, k)
    }
}
