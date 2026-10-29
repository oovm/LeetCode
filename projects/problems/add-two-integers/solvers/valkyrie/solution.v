namespace leetcode.add_two_integers;

[export(case: "camelCase")]
micro sum(num1: i64, num2: i64) -> i64 {
    return num1 + num2
}

class Solution {
    micro sum(self, num1: i64, num2: i64): i64 {
        return sum(num1, num2)
    }
}
