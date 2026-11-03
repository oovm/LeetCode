namespace leetcode.check_whether_two_strings_are_almost_equivalent;

[export(case: "camelCase")]
micro check_almost_equivalent(word1: utf8, word2: utf8) -> bool {
    let n1: usize = word1.length()
    let n2: usize = word2.length()
    let mut letter: i64 = 97
    while letter <= 122 {
        let mut difference: i64 = 0
        let mut i: usize = 0
        while i < n1 {
            if (word1⁅i⁆ as u32 as i64) == letter {
                difference = difference + 1
            }
            i = i + 1
        }
        let mut j: usize = 0
        while j < n2 {
            if (word2⁅j⁆ as u32 as i64) == letter {
                difference = difference - 1
            }
            j = j + 1
        }
        if difference < 0 {
            difference = 0 - difference
        }
        if difference > 3 {
            return false
        }
        letter = letter + 1
    }
    return true
}

class Solution {
    micro checkAlmostEquivalent(self, word1: utf8, word2: utf8): bool {
        return check_almost_equivalent(word1, word2)
    }
}
