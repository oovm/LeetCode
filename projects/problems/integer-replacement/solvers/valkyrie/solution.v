namespace leetcode.integer_replacement;

[export(case: "camelCase")]
micro integer_replacement(n: i64) -> i64 {
    let mut value: i64 = n
    let mut operations: i64 = 0
    while value > 1 {
        let before: i64 = value
        if value % 2 == 0 {
            value = value / 2
        }
        if value == before && (value == 3 || value % 4 == 1) {
            value = value - 1
        }
        if value == before && value != 3 && value % 4 != 1 {
            value = value + 1
        }
        operations = operations + 1
    }
    return operations
}

class Solution {
    micro integerReplacement(self, n: i64): i64 {
        return integer_replacement(n)
    }
}
