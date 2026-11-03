namespace leetcode.substrings_of_size_three_with_distinct_characters;

[export(case: "camelCase")]
micro count_good_substrings(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut count: i64 = 0
    let mut i: usize = 0
    while i + 2 < n {
        let a: i64 = s⁅i⁆ as u32 as i64
        let b: i64 = s⁅i + 1⁆ as u32 as i64
        let c: i64 = s⁅i + 2⁆ as u32 as i64
        if a != b && b != c && a != c {
            count = count + 1
        }
        i = i + 1
    }
    return count
}

class Solution {
    micro countGoodSubstrings(self, s: utf8): i64 {
        return count_good_substrings(s)
    }
}
