namespace leetcode.confusing_number;

[export(case: "camelCase")]
micro confusing_number(n: i64) -> bool {
    let mut original: i64 = n
    let mut rotated: i64 = 0
    while original > 0 {
        let d: i64 = original % 10
        let mut mapped: i64 = d
        if d == 6 {
            mapped = 9
        } else if d == 9 {
            mapped = 6
        } else if d != 0 && d != 1 && d != 8 {
            return false
        }
        rotated = rotated * 10 + mapped
        original = original / 10
    }
    return rotated != n
}

class Solution {
    micro confusingNumber(self, n: i64): bool {
        return confusing_number(n)
    }
}
