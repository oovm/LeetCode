namespace leetcode.number_of_ways_to_paint_n_3_grid;

# 列型只分 aba / abc 两类：aba→aba 3 种、aba→abc 2 种、abc→aba 2 种、abc→abc 2 种。
[export(case: "camelCase")]
micro num_of_ways(n: i64) -> i64 {
    let mut aba: i64 = 6
    let mut abc: i64 = 6
    let mut i: i64 = 1
    while i < n {
        let next_aba: i64 = (3 * aba + 2 * abc) % 1000000007
        let next_abc: i64 = (2 * aba + 2 * abc) % 1000000007
        aba = next_aba
        abc = next_abc
        i = i + 1
    }
    return (aba + abc) % 1000000007
}

class Solution {
    micro numOfWays(self, n: i64): i64 {
        return num_of_ways(n)
    }
}
