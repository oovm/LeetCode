namespace leetcode.domino_and_tromino_tiling;

# f(n) = 2·f(n-1) + f(n-3)，滚动三变量，模 10^9+7。
[export(case: "camelCase")]
micro num_tilings(n: i64) -> i64 {
    if n == 1 {
        return 1
    }
    if n == 2 {
        return 2
    }
    let mut f3: i64 = 1
    let mut f2: i64 = 1
    let mut f1: i64 = 2
    let mut i: i64 = 4
    while i <= n {
        let current: i64 = (2 * f1 % 1000000007 + f3) % 1000000007
        f3 = f2
        f2 = f1
        f1 = current
        i = i + 1
    }
    return f1
}

class Solution {
    micro numTilings(self, n: i64): i64 {
        return num_tilings(n)
    }
}
