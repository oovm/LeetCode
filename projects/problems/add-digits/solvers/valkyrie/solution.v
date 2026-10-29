namespace leetcode.add_digits;

[export(case: "camelCase")]
micro add_digits(num: i64) -> i64 {
    if num == 0 {
        return 0
    }
    return 1 + ((num - 1) % 9)
}

class Solution {
    micro addDigits(self, num: i64): i64 {
        return add_digits(num)
    }
}
