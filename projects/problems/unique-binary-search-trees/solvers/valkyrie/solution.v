namespace leetcode.unique_binary_search_trees;

# 卡特兰数 C(2n,n)/(n+1)：乘性递推 C_{i+1} = C_i · 2(2i+1)/(i+2)，每步整除精确。
[export(case: "camelCase")]
micro num_trees(n: i64) -> i64 {
    let mut catalan: i64 = 1
    let mut i: i64 = 0
    while i < n {
        catalan = catalan * 2 * (2 * i + 1) / (i + 2)
        i = i + 1
    }
    return catalan
}

class Solution {
    micro numTrees(self, n: i64): i64 {
        return num_trees(n)
    }
}
