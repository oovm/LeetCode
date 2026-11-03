namespace leetcode.find_the_winner_of_the_circular_game;

# Josephus：f(1)=0，f(i)=(f(i-1)+k) mod i，答案 f(n)+1。
[export(case: "camelCase")]
micro find_the_winner(n: i64, k: i64) -> i64 {
    let mut survivor: i64 = 0
    let mut i: i64 = 2
    while i <= n {
        survivor = (survivor + k) % i
        i = i + 1
    }
    return survivor + 1
}

class Solution {
    micro findTheWinner(self, n: i64, k: i64): i64 {
        return find_the_winner(n, k)
    }
}
