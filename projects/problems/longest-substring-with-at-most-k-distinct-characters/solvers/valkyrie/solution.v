namespace leetcode.longest_substring_with_at_most_k_distinct_characters;

using std.collection;

# 滑窗内不同字符数 ≤ k：先扩张，再按最左字符收缩，计数归零时删键。
# 不同字符数直接取频次表的键数。
[export(case: "camelCase")]
micro lengthOfLongestSubstringKDistinct(s: utf8, k: i64) -> i64 {
    if k == 0 {
        return 0
    }
    let mut counts: HashMap<char, i64> = HashMap::new(s.length())
    let mut left: usize = 0
    let mut best: i64 = 0
    let mut right: usize = 0
    while right < s.length() {
        let current: char = s⁅right⁆
        let mut next: i64 = 1
        if counts.contains_key(current) {
            next = counts.get(current).unwrap() + 1
        }
        counts.insert(current, next)

        while counts.length() > k as usize {
            let oldest: char = s⁅left⁆
            let rest: i64 = counts.get(oldest).unwrap() - 1
            if rest == 0 {
                counts.remove(oldest)
            }
            else {
                counts.insert(oldest, rest)
            }
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
    micro lengthOfLongestSubstringKDistinct(self, s: utf8, k: i64): i64 {
        return lengthOfLongestSubstringKDistinct(s, k)
    }
}
