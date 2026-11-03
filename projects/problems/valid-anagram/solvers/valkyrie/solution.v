namespace leetcode.valid_anagram;

# 字符计数配对，O(n)
[export(case: "camelCase")]
micro is_anagram(s: utf8, t: utf8) -> bool {
    if s.length() != t.length() {
        return false
    }
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut i: usize = 0
    while i < s.length() {
        let key: i64 = s⁅i⁆ as u32 as i64
        let mut seen: i64 = 0
        if counts.contains_key(key) {
            seen = counts.get(key).unwrap()
        }
        counts.insert(key, seen + 1)
        i = i + 1
    }
    let mut k: usize = 0
    while k < t.length() {
        let key: i64 = t⁅k⁆ as u32 as i64
        let mut left: i64 = 0
        if counts.contains_key(key) {
            left = counts.get(key).unwrap()
        }
        if left == 0 {
            return false
        }
        counts.insert(key, left - 1)
        k = k + 1
    }
    return true
}

class Solution {
    micro isAnagram(self, s: utf8, t: utf8): bool {
        return is_anagram(s, t)
    }
}
