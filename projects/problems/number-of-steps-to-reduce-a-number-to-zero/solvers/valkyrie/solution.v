namespace leetcode.number_of_steps_to_reduce_a_number_to_zero;

[export(case: "camelCase")]
micro number_of_steps(num: i64) -> i64 {
    let mut steps: i64 = 0
    let mut n: i64 = num
    while n > 0 {
        if n % 2 == 0 {
            n = n / 2
        } else {
            n = n - 1
        }
        steps = steps + 1
    }
    return steps
}

class Solution {
    micro numberOfSteps(self, num: i64): i64 {
        return number_of_steps(num)
    }
}
