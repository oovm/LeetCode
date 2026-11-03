namespace leetcode.minimum_number_of_pushes_to_type_word_i;

[export(case: "camelCase")]
micro minimum_pushes(word: utf8) -> i64 {
    let mut seen: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        seen.push(0)
        i = i + 1
    }
    let mut distinct: i64 = 0
    i = 0
    while i < word.length() {
        let c: u32 = word⁅i⁆ as u32
        if c >= 97 && c <= 122 {
            let idx: usize = (c - 97) as usize
            if seen⁅idx⁆.unwrap() == 0 {
                seen⁅idx⁆ = 1
                distinct = distinct + 1
            }
        }
        i = i + 1
    }
    let mut total: i64 = 0
    let mut rem: i64 = distinct
    let mut round: i64 = 1
    while rem > 0 {
        let mut take: i64 = 8
        if rem < take {
            take = rem
        }
        total = total + round * take
        rem = rem - take
        round = round + 1
    }
    return total
}

class Solution {
    micro minimumPushes(self, word: utf8): i64 {
        return minimum_pushes(word)
    }
}
