namespace leetcode.make_three_strings_equal;

[export(case: "camelCase")]
micro find_minimum_operations(s1: utf8, s2: utf8, s3: utf8) -> i64 {
    let a: usize = s1.length()
    let b: usize = s2.length()
    let c: usize = s3.length()
    let total_len: i64 = a as i64 + b as i64 + c as i64
    let mut limit: usize = a
    if b < limit {
        limit = b
    }
    if c < limit {
        limit = c
    }
    let mut i: usize = 0
    let mut same: bool = true
    while i < limit && same {
        let x: u32 = s1⁅i⁆ as u32
        let y: u32 = s2⁅i⁆ as u32
        let z: u32 = s3⁅i⁆ as u32
        if (x == y) && (y == z) {
            i = i + 1
        } else {
            same = false
        }
    }
    if i == 0 {
        if total_len == 0 {
            return 0
        }
        return -1
    }
    let prefix: i64 = i as i64
    return total_len - 3 * prefix
}

class Solution {
    micro findMinimumOperations(self, s1: utf8, s2: utf8, s3: utf8): i64 {
        return find_minimum_operations(s1, s2, s3)
    }
}
