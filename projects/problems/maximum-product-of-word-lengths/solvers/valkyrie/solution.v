namespace leetcode.solution

using std.collection

# 题内触发点: 每个单词一个 `BitSet(26)` 字母集；两两不相交靠复制后 `intersect` 再判空（G25）。
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
    # `intersect` 改写左操作数，故先复制；字母集只有一个 word，复制与判定都是 O(1)。
    let mut probe: BitSet = left.clone()
    probe.intersect(right)
    return probe.is_empty()
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
