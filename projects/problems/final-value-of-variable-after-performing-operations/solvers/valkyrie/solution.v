namespace leetcode.final_value_of_variable_after_performing_operations;

[export(case: "camelCase")]
micro final_value_after_operations(operations: [utf8]) -> i64 {
    let mut x: i64 = 0
    let mut i: usize = 0
    while i < operations.length() {
        let op: utf8 = operations⁅i⁆
        let mid: u32 = op⁅1⁆ as u32
        if mid == 43 {
            x = x + 1
        } else {
            x = x - 1
        }
        i = i + 1
    }
    return x
}

class Solution {
    micro finalValueAfterOperations(self, operations: [utf8]): i64 {
        return final_value_after_operations(operations)
    }
}
