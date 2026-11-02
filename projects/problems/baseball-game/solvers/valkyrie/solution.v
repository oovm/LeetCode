namespace leetcode.baseball_game;

micro parse_number(op: utf8) -> i64 {
    let n: usize = op.length()
    let mut value: i64 = 0
    let mut negative: bool = false
    let mut i: usize = 0
    if op⁅0⁆ as u32 == 45 {
        negative = true
        i = 1
    }
    while i < n {
        value = value * 10 + (op⁅i⁆ as u32 as i64 - 48)
        i = i + 1
    }
    if negative {
        return 0 - value
    }
    return value
}

micro is_number(op: utf8) -> bool {
    let code: u32 = op⁅0⁆ as u32
    if code == 45 {
        return true
    }
    return code >= 48 && code <= 57
}

[export(case: "camelCase")]
micro cal_points(operations: ArrayList<utf8>) -> i64 {
    let mut stack: ArrayList<i64> = ArrayList::new(operations.length())
    let mut i: usize = 0
    while i < operations.length() {
        let op: utf8 = operations⁅i⁆.unwrap()
        let code: u32 = op⁅0⁆ as u32
        if code == 43 {
            let last: i64 = stack⁅stack.length() - 1⁆.unwrap()
            let prev: i64 = stack⁅stack.length() - 2⁆.unwrap()
            stack.push(last + prev)
        } else if code == 68 {
            let last: i64 = stack⁅stack.length() - 1⁆.unwrap()
            stack.push(last * 2)
        } else if code == 67 {
            stack.pop()
        } else {
            stack.push(parse_number(op))
        }
        i = i + 1
    }
    let mut total: i64 = 0
    let mut j: usize = 0
    while j < stack.length() {
        total = total + stack⁅j⁆.unwrap()
        j = j + 1
    }
    return total
}

class Solution {
    micro calPoints(self, operations: ArrayList<utf8>): i64 {
        return cal_points(operations)
    }
}
