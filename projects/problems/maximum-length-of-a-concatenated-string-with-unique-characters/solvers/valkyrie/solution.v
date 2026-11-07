namespace leetcode.solution

using std.collection

# 题内触发点: G25 —— 每个词一个 `BitSet(26)` 字母集，搜索时按「复制当前并集 + 合并 + 取基数」判定重叠。
# 依赖 `std.collection.BitSet` 的 `clone()` 与 `count()`（G25 已提供，见缺口账本）：
# 现有 `union(mut self, other: BitSet)` 会把右侧值并入自身，故每次合并必须先复制两侧。
micro search(words: ArrayList<BitSet>, sizes: ArrayList<i64>, start: usize, current: BitSet, current_size: i64) -> i64 {
    let mut best: i64 = current_size
    let mut index: usize = start
    while index < words.length() {
        let word_size: i64 = sizes⁅index⁆
        if word_size >= 0 {
            let merged: BitSet = current.clone()
            merged.union(words⁅index⁆.clone())
            if (merged.count() as i64) == current_size + word_size {
                let candidate: i64 = search(words, sizes, index + 1, merged, current_size + word_size)
                if candidate > best {
                    best = candidate
                }
            }
        }
        index = index + 1
    }
    return best
}

class Solution {
    [export(case: "camelCase")]
    micro maxLength(arr: ArrayList<utf8>) -> i64 {
        let mut words: ArrayList<BitSet> = ArrayList::new(arr.length())
        let mut sizes: ArrayList<i64> = ArrayList::new(arr.length())
        loop word in arr {
            let mut letters: BitSet = BitSet::with_capacity(26)
            let mut duplicate: bool = false
            let mut position: usize = 0
            while position < word.byte_length() {
                let code: u8 = word.byte_at(position)
                let slot: usize = (code - 97) as usize
                if letters.get(slot) {
                    duplicate = true
                }
                letters.set(slot)
                position = position + 1
            }
            if duplicate {
                # 自身含重复字母的词不能进入任何拼接，用 -1 标记跳过。
                words.push(BitSet::with_capacity(26))
                sizes.push(0 - 1)
            } else {
                words.push(letters)
                sizes.push(word.byte_length() as i64)
            }
        }

        let empty: BitSet = BitSet::with_capacity(26)
        return search(words, sizes, 0, empty, 0)
    }
}
