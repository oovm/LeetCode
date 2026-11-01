namespace leetcode.count_operations_to_obtain_zero;

[export(case: "camelCase")]
micro count_operations(num1: i64, num2: i64) -> i64 {
    let mut a: i64 = num1
    let mut b: i64 = num2
    let mut operations: i64 = 0
    while a > 0 && b > 0 {
        if a >= b {
            a = a - b
        } else {
            b = b - a
        }
        operations = operations + 1
    }
    return operations
}

class Solution {
    micro countOperations(self, num1: i64, num2: i64): i64 {
        return count_operations(num1, num2)
    }
}
