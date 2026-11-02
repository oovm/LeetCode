namespace leetcode.first_unique_character_in_a_string;

[export(case: "camelCase")]
micro first_uniq_char(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut i: usize = 0
    while i < n {
        let key: i64 = s⁅i⁆ as u32 as i64
        let mut seen: i64 = 0
        if counts.contains_key(key) {
            seen = counts.get(key).unwrap()
        }
        counts.insert(key, seen + 1)
        i = i + 1
    }
    let mut j: usize = 0
    while j < n {
        let key: i64 = s⁅j⁆ as u32 as i64
        if counts.get(key).unwrap() == 1 {
            return j as i64
        }
        j = j + 1
    }
    return -1
}

class Solution {
    micro firstUniqChar(self, s: utf8): i64 {
        return first_uniq_char(s)
    }
}
