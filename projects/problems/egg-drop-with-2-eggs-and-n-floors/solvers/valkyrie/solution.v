namespace leetcode.egg_drop_with_2_eggs_and_n_floors;

# 最小 k 使 k(k+1)/2 ≥ n。
[export(case: "camelCase")]
micro two_egg_drop(n: i64) -> i64 {
    let mut k: i64 = 0
    while k * (k + 1) / 2 < n {
        k = k + 1
    }
    return k
}

class Solution {
    micro twoEggDrop(self, n: i64): i64 {
        return two_egg_drop(n)
    }
}
