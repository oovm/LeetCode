namespace leetcode.palindrome_permutation;

# 统计奇频字符个数，至多一个，O(n)
[export(case: "camelCase")]
micro can_permute_palindrome(s: utf8) -> bool {
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut odd: i64 = 0
    let mut i: usize = 0
    while i < s.length() {
        let key: i64 = s⁅i⁆ as u32 as i64
        let mut seen: i64 = 0
        if counts.contains_key(key) {
            seen = counts.get(key).unwrap()
        }
        if seen % 2 == 0 {
            odd = odd + 1
        } else {
            odd = odd - 1
        }
        counts.insert(key, seen + 1)
        i = i + 1
    }
    return odd <= 1
}

class Solution {
    micro canPermutePalindrome(self, s: utf8): bool {
        return can_permute_palindrome(s)
    }
}
