namespace leetcode.subtree_removal_game_with_fibonacci_tree;

# 绿色 Hackenbush：g(1)=0、g(2)=1，g(n)=(g(n-2)+1) xor (g(n-1)+1)，非零则先手胜。
[export(case: "camelCase")]
micro find_game_winner(n: i64) -> bool {
    if n == 1 {
        return false
    }
    let mut left: i64 = 0
    let mut right: i64 = 1
    let mut i: i64 = 3
    let mut g: i64 = 0
    while i <= n {
        g = (left + 1).bit_xor(right + 1)
        left = right
        right = g
        i = i + 1
    }
    return right != 0
}

class Solution {
    micro findGameWinner(self, n: i64): bool {
        return find_game_winner(n)
    }
}
