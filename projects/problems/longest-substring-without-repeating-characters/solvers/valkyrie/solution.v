namespace leetcode.longest_substring_without_repeating_characters;

[export(case: "camelCase")]
micro length_of_longest_substring(s: utf8) -> i64 {
    if s.length() == 0 {
        return 0
    }
    let mut last: HashMap<i64, i64> = HashMap::new(0)
    let mut left: i64 = 0
    let mut ans: i64 = 0
    let mut j: usize = 0
    while j < s.length() {
        let code: i64 = s.char_at(j).unwrap() as u32 as i64
        if last.contains_key(code) {
            let prev: i64 = last.get(code).unwrap()
            if prev + 1 > left {
                left = prev + 1
            }
        }
        last.insert(code, j as i64)
        let width: i64 = j as i64 - left + 1
        if width > ans {
            ans = width
        }
        j = j + 1
    }
    return ans
}

class Solution {
    micro lengthOfLongestSubstring(self, s: utf8): i64 {
        return length_of_longest_substring(s)
    }
}
