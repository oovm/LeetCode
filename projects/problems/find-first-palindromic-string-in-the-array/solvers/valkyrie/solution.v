namespace leetcode.find_first_palindromic_string_in_the_array;

using std.collection;

# 双指针夹逼，比较停在 `char` 的 `!=` 上（`utf8` 的 Cardinal 视图），不引入反向字符串。
[export(case: "camelCase")]
micro first_palindrome(words: ArrayList<utf8>) -> utf8 {
    let mut i: usize = 0
    while i < words.length() {
        let word: utf8 = words⁅i⁆
        let mut left: usize = 0
        let mut right: usize = word.length()
        let mut mirrored: bool = true
        while left < right {
            right = right - 1
            let head: char = word⁅left⁆
            let tail: char = word⁅right⁆
            if head != tail {
                mirrored = false
            }
            left = left + 1
        }
        if mirrored {
            return word
        }
        i = i + 1
    }
    return ""
}

class Solution {
    micro firstPalindrome(self, words: ArrayList<utf8>): utf8 {
        return first_palindrome(words)
    }
}
