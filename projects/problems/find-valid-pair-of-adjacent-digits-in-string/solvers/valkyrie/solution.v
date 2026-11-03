namespace leetcode.find_valid_pair_of_adjacent_digits_in_string;

# 位数频次需等于位值，再找首个相邻互异且双方均合格的位对。
[export(case: "camelCase")]
micro find_valid_pair(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut counts: ArrayList<i64> = ArrayList::new(10)
    let mut k: usize = 0
    while k < 10 {
        counts.push(0)
        k = k + 1
    }
    let mut i: usize = 0
    while i < n {
        let digit: usize = (s⁅i⁆ as u32 - 48) as usize
        counts⁅digit⁆ = counts⁅digit⁆ + 1
        i = i + 1
    }
    k = 1
    while k < 10 {
        if counts⁅k⁆ != k as i64 {
            counts⁅k⁆ = -1
        }
        k = k + 1
    }
    i = 0
    while i + 1 < n {
        let first: i64 = s⁅i⁆ as u32 as i64 - 48
        let second: i64 = s⁅i + 1⁆ as u32 as i64 - 48
        if first != second && counts⁅first as usize⁆ == first && counts⁅second as usize⁆ == second {
            let mut builder: Utf8Builder = Utf8Builder::new(2)
            builder.append(s⁅i⁆)
            builder.append(s⁅i + 1⁆)
            return builder.build()
        }
        i = i + 1
    }
    let empty: utf8 = Utf8Text::from_bytes([])
    return empty
}

class Solution {
    micro findValidPair(self, s: utf8): utf8 {
        return find_valid_pair(s)
    }
}
