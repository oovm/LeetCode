namespace leetcode.check_if_all_characters_have_equal_number_of_occurrences;

[export(case: "camelCase")]
micro are_occurrences_equal(s: utf8) -> bool {
    let n: usize = s.length()
    let mut target: i64 = -1
    let mut letter: i64 = 97
    while letter <= 122 {
        let mut count: i64 = 0
        let mut i: usize = 0
        while i < n {
            if (s⁅i⁆ as u32 as i64) == letter {
                count = count + 1
            }
            i = i + 1
        }
        if count > 0 {
            if target < 0 {
                target = count
            } else if count != target {
                return false
            }
        }
        letter = letter + 1
    }
    return true
}

class Solution {
    micro areOccurrencesEqual(self, s: utf8): bool {
        return are_occurrences_equal(s)
    }
}
