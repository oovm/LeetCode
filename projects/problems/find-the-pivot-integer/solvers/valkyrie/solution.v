namespace leetcode.find_the_pivot_integer;

[export(case: "camelCase")]
micro pivot_integer(n: i64) -> i64 {
    let total: i64 = n * (n + 1) / 2
    let mut prefix: i64 = 0
    let mut value: i64 = 1
    while value <= n {
        prefix = prefix + value
        let suffix: i64 = total - prefix + value
        if prefix == suffix {
            return value
        }
        value = value + 1
    }
    return -1
}

class Solution {
    micro pivotInteger(self, n: i64): i64 {
        return pivot_integer(n)
    }
}
