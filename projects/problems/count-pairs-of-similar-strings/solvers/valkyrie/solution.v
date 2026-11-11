namespace leetcode.count_pairs_of_similar_strings;

using std.collection;

# 相似 = 去重字符集相同：把字符集压成 26 位掩码，`HashMap<i64, i64>` 计数，逐词累加同掩码前驱数即配对数。
micro char_mask(word: utf8) -> i64 {
    let mut mask: i64 = 0
    let mut i: usize = 0
    while i < word.length() {
        let letter: usize = ((word⁅i⁆ as u32) as i64 - 97) as usize
        mask = mask.bit_or((1 as i64).bit_shift_left(letter as i64))
        i = i + 1
    }
    return mask
}

[export(case: "camelCase")]
micro similarPairs(words: [utf8]) -> i64 {
    let mut seen: HashMap<i64, i64> = HashMap::new(0)
    let mut total: i64 = 0
    loop word in words {
        let mask: i64 = char_mask(word)
        let mut prior: i64 = 0
        if seen.contains_key(mask) {
            prior = seen.get(mask).unwrap()
        }
        total = total + prior
        seen.insert(mask, prior + 1)
    }
    return total
}

class Solution {
    micro similarPairs(self, words: [utf8]): i64 {
        return similarPairs(words)
    }
}
