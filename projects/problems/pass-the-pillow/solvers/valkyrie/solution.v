namespace leetcode.pass_the_pillow;

[export(case: "camelCase")]
micro pass_the_pillow(n: i64, time: i64) -> i64 {
    let cycle: i64 = 2 * (n - 1)
    let position: i64 = time % cycle
    if position <= n - 1 {
        return position + 1
    }
    return 2 * n - 1 - position
}

class Solution {
    micro passThePillow(self, n: i64, time: i64): i64 {
        return pass_the_pillow(n, time)
    }
}
