namespace leetcode.detect_capital;

[export(case: "camelCase")]
micro detect_capital_use(word: utf8) -> bool {
    let n: usize = word.length()
    let mut i: usize = 0
    let mut caps: usize = 0
    while i < n {
        let code: u32 = word⁅i⁆ as u32
        if code >= 65 && code <= 90 {
            caps = caps + 1
        }
        i = i + 1
    }
    if caps == 0 {
        return true
    }
    if caps == n {
        return true
    }
    if caps == 1 {
        let first: u32 = word⁅0⁆ as u32
        return first >= 65 && first <= 90
    }
    return false
}

class Solution {
    micro detectCapitalUse(self, word: utf8): bool {
        return detect_capital_use(word)
    }
}
