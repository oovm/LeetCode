namespace leetcode.count_the_number_of_special_characters_i;

# 分别标记出现过的小写与大写字母，再数同字母双态都出现者。
[export(case: "camelCase")]
micro number_of_special_chars(word: utf8) -> i64 {
    let n: usize = word.length()
    let mut lower: ArrayList<i64> = ArrayList::new(26)
    let mut upper: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        lower.push(0)
        upper.push(0)
        i = i + 1
    }
    i = 0
    while i < n {
        let code: u32 = word⁅i⁆ as u32
        if code >= 97 && code <= 122 {
            let slot: usize = (code - 97) as usize
            lower⁅slot⁆ = 1
        } else if code >= 65 && code <= 90 {
            let slot: usize = (code - 65) as usize
            upper⁅slot⁆ = 1
        }
        i = i + 1
    }
    let mut count: i64 = 0
    i = 0
    while i < 26 {
        if lower⁅i⁆.unwrap() == 1 && upper⁅i⁆.unwrap() == 1 {
            count = count + 1
        }
        i = i + 1
    }
    return count
}

class Solution {
    micro numberOfSpecialChars(self, word: utf8): i64 {
        return number_of_special_chars(word)
    }
}
