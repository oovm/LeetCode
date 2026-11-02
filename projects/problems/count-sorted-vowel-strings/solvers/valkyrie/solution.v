namespace leetcode.count_sorted_vowel_strings;

[export(case: "camelCase")]
micro count_vowel_strings(n: i64) -> i64 {
    let mut va: i64 = 1
    let mut ve: i64 = 1
    let mut vi: i64 = 1
    let mut vo: i64 = 1
    let mut vu: i64 = 1
    let mut step: i64 = 1
    while step < n {
        ve = ve + va
        vi = vi + ve
        vo = vo + vi
        vu = vu + vo
        step = step + 1
    }
    return va + ve + vi + vo + vu
}

class Solution {
    micro countVowelStrings(self, n: i64): i64 {
        return count_vowel_strings(n)
    }
}
