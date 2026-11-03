namespace leetcode.k_th_symbol_in_grammar;

# 第 n 行第 k 个 = popcount(k-1) 的奇偶（0 索引化后与 n 无关）。
[export(case: "camelCase")]
micro kth_grammar(n: i64, k: i64) -> i64 {
    let mut bits: i64 = k - 1
    let mut parity: i64 = 0
    while bits > 0 {
        parity = parity + bits % 2
        bits = bits / 2
    }
    return parity % 2
}

class Solution {
    micro kthGrammar(self, n: i64, k: i64): i64 {
        return kth_grammar(n, k)
    }
}
