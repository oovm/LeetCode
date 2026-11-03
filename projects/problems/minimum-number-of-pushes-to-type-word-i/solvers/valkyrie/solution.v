namespace leetcode.minimum_number_of_pushes_to_type_word_i;

# 每个字母的按键代价由首次出现次序决定（前 8 个 1 次，之后每 8 个加 1），再乘以出现次数。
[export(case: "camelCase")]
micro minimum_pushes(word: utf8) -> i64 {
    let mut freq: ArrayList<i64> = ArrayList::new(26)
    let mut order: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        freq.push(0)
        i = i + 1
    }
    i = 0
    while i < word.length() {
        let c: u32 = word⁅i⁆ as u32
        if c >= 97 && c <= 122 {
            let idx: usize = (c - 97) as usize
            if freq⁅idx⁆ == 0 {
                order.push(idx as i64)
            }
            freq⁅idx⁆ = freq⁅idx⁆ + 1
        }
        i = i + 1
    }
    let mut total: i64 = 0
    let mut k: usize = 0
    while k < order.length() {
        let letter: i64 = order⁅k⁆
        let layer: i64 = (k as i64) / 8 + 1
        total = total + layer * freq⁅letter as usize⁆
        k = k + 1
    }
    return total
}

class Solution {
    micro minimumPushes(self, word: utf8): i64 {
        return minimum_pushes(word)
    }
}
