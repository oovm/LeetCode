namespace leetcode.maximum_length_substring_with_two_occurrences;

# 滑窗保证窗内任一字符出现不超过两次。
[export(case: "camelCase")]
micro maximum_length_substring(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut counts: ArrayList<i64> = ArrayList::new(26)
    let mut k: usize = 0
    while k < 26 {
        counts.push(0)
        k = k + 1
    }
    let mut left: usize = 0
    let mut right: usize = 0
    let mut best: i64 = 0
    while right < n {
        let slot: usize = (s⁅right⁆ as u32 - 97) as usize
        counts⁅slot⁆ = counts⁅slot⁆ + 1
        while counts⁅slot⁆ > 2 {
            let drop: usize = (s⁅left⁆ as u32 - 97) as usize
            counts⁅drop⁆ = counts⁅drop⁆ - 1
            left = left + 1
        }
        let width: i64 = (right - left + 1) as i64
        if width > best {
            best = width
        }
        right = right + 1
    }
    return best
}

class Solution {
    micro maximumLengthSubstring(self, s: utf8): i64 {
        return maximum_length_substring(s)
    }
}
