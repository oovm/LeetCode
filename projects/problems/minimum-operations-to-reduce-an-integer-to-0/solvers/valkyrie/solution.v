namespace leetcode.minimum_operations_to_reduce_an_integer_to_0;

# 贪心：偶数免费折半；奇数按 mod 4 决定 +1 / -1（1 单独终结）。
[export(case: "camelCase")]
micro min_operations(n: i64) -> i64 {
    let mut current: i64 = n
    let mut operations: i64 = 0
    while current > 0 {
        if current % 2 == 0 {
            current = current / 2
        } else if current == 1 || current % 4 == 1 {
            current = current - 1
            operations = operations + 1
        } else {
            current = current + 1
            operations = operations + 1
        }
    }
    return operations
}

class Solution {
    micro minOperations(self, n: i64): i64 {
        return min_operations(n)
    }
}
