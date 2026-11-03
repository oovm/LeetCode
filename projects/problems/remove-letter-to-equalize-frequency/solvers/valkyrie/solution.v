namespace leetcode.remove_letter_to_equalize_frequency;

[export(case: "camelCase")]
micro equal_frequency(word: utf8) -> bool {
    let mut counts: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        counts.push(0)
        i = i + 1
    }
    i = 0
    while i < word.length() {
        let idx: usize = (word⁅i⁆ as u32 - 97) as usize
        counts⁅idx⁆ = counts⁅idx⁆ + 1
        i = i + 1
    }
    let mut remove: usize = 0
    while remove < 26 {
        if counts⁅remove⁆ > 0 {
            counts⁅remove⁆ = counts⁅remove⁆ - 1
            let mut target: i64 = 0
            let mut ok: bool = true
            let mut j: usize = 0
            while j < 26 {
                let c: i64 = counts⁅j⁆
                if c > 0 {
                    if target == 0 {
                        target = c
                    } else if c != target {
                        ok = false
                    }
                }
                j = j + 1
            }
            if ok {
                return true
            }
            counts⁅remove⁆ = counts⁅remove⁆ + 1
        }
        remove = remove + 1
    }
    return false
}

class Solution {
    micro equalFrequency(self, word: utf8): bool {
        return equal_frequency(word)
    }
}
