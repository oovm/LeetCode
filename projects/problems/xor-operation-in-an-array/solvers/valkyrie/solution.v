namespace leetcode.xor_operation_in_an_array;

micro xor_values(left: i64, right: i64) -> i64 {
    let mut x: i64 = left
    let mut y: i64 = right
    let mut result: i64 = 0
    let mut place: i64 = 1
    while x > 0 || y > 0 {
        let left_bit: i64 = x % 2
        let right_bit: i64 = y % 2
        if left_bit != right_bit {
            result = result + place
        }
        x = x / 2
        y = y / 2
        place = place * 2
    }
    return result
}

[export(case: "camelCase")]
micro xor_operation(n: i64, start: i64) -> i64 {
    let mut result: i64 = 0
    let mut index: i64 = 0
    while index < n {
        result = xor_values(result, start + 2 * index)
        index = index + 1
    }
    return result
}

class Solution {
    micro xorOperation(self, n: i64, start: i64): i64 {
        return xor_operation(n, start)
    }
}
