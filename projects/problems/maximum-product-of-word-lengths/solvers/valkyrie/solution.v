namespace leetcode.solution

using std.collection

# 题内触发点: 每个单词一个 `BitSet(26)` 字母集；两两不相交靠 `get` 逐位判定，
# 因为 BitSet 没有 `clone`，无法复制后 `intersect` 再检查（G25）。
micro letters_of(word: utf8) -> BitSet {
    let letters: BitSet = BitSet::with_capacity(26)
    let mut index: usize = 0
    while index < word.byte_length() {
        let code: u8 = word.byte_at(index)
        letters.set((code - 97) as usize)
        index = index + 1
    }
    return letters
}

micro disjoint(left: BitSet, right: BitSet) -> bool {
    let mut letter: usize = 0
    while letter < 26 {
        if left.get(letter) && right.get(letter) {
            return false
        }
        letter = letter + 1
    }
    return true
}

class Solution {
    [export(case: "camelCase")]
    micro maxProduct(words: ArrayList<utf8>) -> i64 {
        let masks: ArrayList<BitSet> = ArrayList::new(words.length())
        loop word in words {
            masks.push(letters_of(word))
        }
        let mut best: i64 = 0
        let mut left: usize = 0
        while left < masks.length() {
            let mut right: usize = left + 1
            while right < masks.length() {
                if disjoint(masks⁅left⁆, masks⁅right⁆) {
                    let product: i64 = (words⁅left⁆.byte_length() * words⁅right⁆.byte_length()) as i64
                    if product > best {
                        best = product
                    }
                }
                right = right + 1
            }
            left = left + 1
        }
        return best
    }
}
