namespace leetcode.minimum_number_of_operations_to_convert_time;

micro to_minutes(t: utf8) -> i64 {
    let h1: i64 = t⁅0⁆ as u32 as i64 - 48
    let h2: i64 = t⁅1⁆ as u32 as i64 - 48
    let m1: i64 = t⁅3⁆ as u32 as i64 - 48
    let m2: i64 = t⁅4⁆ as u32 as i64 - 48
    return (h1 * 10 + h2) * 60 + m1 * 10 + m2
}

[export(case: "camelCase")]
micro convert_time(current: utf8, correct: utf8) -> i64 {
    let mut diff: i64 = to_minutes(correct) - to_minutes(current)
    let mut ops: i64 = 0
    ops = ops + diff / 60
    diff = diff % 60
    ops = ops + diff / 15
    diff = diff % 15
    ops = ops + diff / 5
    diff = diff % 5
    ops = ops + diff
    return ops
}

class Solution {
    micro convertTime(self, current: utf8, correct: utf8): i64 {
        return convert_time(current, correct)
    }
}
