namespace leetcode.count_vowel_substrings_of_a_string;

micro vowel_bit(code: i64) -> i64 {
    if code == 97 {
        return 1
    }
    if code == 101 {
        return 2
    }
    if code == 105 {
        return 4
    }
    if code == 111 {
        return 8
    }
    if code == 117 {
        return 16
    }
    return 0
}

[export(case: "camelCase")]
micro count_vowel_substrings(word: utf8) -> i64 {
    let n: usize = word.length()
    let mut count: i64 = 0
    let mut i: usize = 0
    while i < n {
        let mut mask: i64 = 0
        let mut j: usize = i
        let mut scanning: bool = true
        while j < n && scanning {
            let bit: i64 = vowel_bit(word⁅j⁆ as u32 as i64)
            if bit == 0 {
                scanning = false
            } else {
                mask = mask | bit
                if mask == 31 {
                    count = count + 1
                }
                j = j + 1
            }
        }
        i = i + 1
    }
    return count
}

class Solution {
    micro countVowelSubstrings(self, word: utf8): i64 {
        return count_vowel_substrings(word)
    }
}
