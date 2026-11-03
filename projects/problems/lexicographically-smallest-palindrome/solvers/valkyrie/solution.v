namespace leetcode.lexicographically_smallest_palindrome;

[export(case: "camelCase")]
micro make_smallest_palindrome(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut chars: ArrayList<char> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        chars.push(s⁅i⁆)
        i = i + 1
    }
    let half: usize = n / 2
    i = 0
    while i < half {
        let j: usize = n - 1 - i
        let a: u32 = chars⁅i⁆ as u32
        let b: u32 = chars⁅j⁆ as u32
        let mut m: u32 = a
        if b < a {
            m = b
        }
        chars⁅i⁆ = char::from(m)
        chars⁅j⁆ = char::from(m)
        i = i + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    i = 0
    while i < n {
        builder.append(chars⁅i⁆)
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro makeSmallestPalindrome(self, s: utf8): utf8 {
        return make_smallest_palindrome(s)
    }
}
