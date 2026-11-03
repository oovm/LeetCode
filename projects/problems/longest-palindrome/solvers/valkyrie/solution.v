namespace leetcode.longest_palindrome;

# 计数成对字符，奇频字符最多贡献 1 个中心，O(n)
[export(case: "camelCase")]
micro longest_palindrome(s: utf8) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut length: i64 = 0
    let mut odd: i64 = 0
    let mut i: usize = 0
    while i < s.length() {
        let key: i64 = s⁅i⁆ as u32 as i64
        let mut seen: i64 = 0
        if counts.contains_key(key) {
            seen = counts.get(key).unwrap()
        }
        seen = seen + 1
        counts.insert(key, seen)
        if seen % 2 == 0 {
            length = length + 2
            odd = odd - 1
        } else {
            odd = odd + 1
        }
        i = i + 1
    }
    if odd > 0 {
        return length + 1
    }
    return length
}

class Solution {
    micro longestPalindrome(self, s: utf8): i64 {
        return longest_palindrome(s)
    }
}
