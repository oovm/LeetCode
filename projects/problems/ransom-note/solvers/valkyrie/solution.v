namespace leetcode.ransom_note;

# 杂志字符计数，逐字扣减，O(n)
[export(case: "camelCase")]
micro can_construct(ransomNote: utf8, magazine: utf8) -> bool {
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut i: usize = 0
    while i < magazine.length() {
        let key: i64 = magazine⁅i⁆ as u32 as i64
        let mut seen: i64 = 0
        if counts.contains_key(key) {
            seen = counts.get(key).unwrap()
        }
        counts.insert(key, seen + 1)
        i = i + 1
    }
    let mut k: usize = 0
    while k < ransomNote.length() {
        let key: i64 = ransomNote⁅k⁆ as u32 as i64
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
    micro canConstruct(self, ransomNote: utf8, magazine: utf8): bool {
        return can_construct(ransomNote, magazine)
    }
}
