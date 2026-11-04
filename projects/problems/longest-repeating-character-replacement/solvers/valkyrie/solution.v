namespace leetcode.longest_repeating_character_replacement;

using std.collection;

# 滑窗保持「窗长 - 窗口内最大频次 ≤ k」：右端扩张，超出预算时左端收缩一格。
# 频次以字符为键；`max_freq` 只记录历史最大频次，收缩时不回退。
[export(case: "camelCase")]
micro characterReplacement(s: utf8, k: i64) -> i64 {
    let mut counts: HashMap<char, i64> = HashMap::new(s.length())
    let mut left: usize = 0
    let mut max_freq: i64 = 0
    let mut best: i64 = 0
    let mut right: usize = 0
    while right < s.length() {
        let current: char = s⁅right⁆
        let mut next: i64 = 1
        if counts.contains_key(current) {
            next = counts.get(current).unwrap() + 1
        }
        counts.insert(current, next)
        if next > max_freq {
            max_freq = next
        }

        if (right as i64 - left as i64 + 1) - max_freq > k {
            let oldest: char = s⁅left⁆
            counts.insert(oldest, counts.get(oldest).unwrap() - 1)
            left = left + 1
        }

        let window: i64 = right as i64 - left as i64 + 1
        if window > best {
            best = window
        }
        right = right + 1
    }
    return best
}

class Solution {
    micro characterReplacement(self, s: utf8, k: i64): i64 {
        return characterReplacement(s, k)
    }
}
