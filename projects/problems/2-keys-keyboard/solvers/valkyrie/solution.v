namespace leetcode.two_keys_keyboard;

[export(case: "camelCase")]
micro min_steps(n: i64) -> i64 {
    let mut steps: i64 = 0
    let mut remaining: i64 = n
    let mut divisor: i64 = 2
    while remaining > 1 {
        while remaining % divisor == 0 {
            steps = steps + divisor
            remaining = remaining / divisor
        }
        divisor = divisor + 1
    }
    return steps
}

class Solution {
    micro minSteps(self, n: i64): i64 {
        return min_steps(n)
    }
}
