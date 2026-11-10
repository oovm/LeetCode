namespace leetcode.verifying_an_alien_dictionary;

using std.collection;

# 按 `order` 构造 26 位 rank 表；相邻两词逐字符比较 rank，首次不等即判序；全部相等则按长度判。
micro rank_table(order: utf8) -> ArrayList<i64> {
    let mut rank: ArrayList<i64> = ArrayList::new(26)
    let mut slot: usize = 0
    while slot < 26 {
        rank.push(0)
        slot = slot + 1
    }
    let mut i: usize = 0
    while i < order.length() {
        let letter: usize = ((order⁅i⁆ as u32) as i64 - 97) as usize
        rank⁅letter⁆ = i as i64
        i = i + 1
    }
    return rank
}

micro compare(a: utf8, b: utf8, rank: ArrayList<i64>) -> i64 {
    let mut i: usize = 0
    while i < a.length() && i < b.length() {
        let ra: i64 = rank⁅((a⁅i⁆ as u32) as i64 - 97) as usize⁆
        let rb: i64 = rank⁅((b⁅i⁆ as u32) as i64 - 97) as usize⁆
        if ra != rb {
            return ra - rb
        }
        i = i + 1
    }
    return a.length() as i64 - b.length() as i64
}

[export(case: "camelCase")]
micro isAlienSorted(words: ArrayList<utf8>, order: utf8) -> bool {
    let rank: ArrayList<i64> = rank_table(order)
    let mut i: usize = 1
    while i < words.length() {
        if compare(words⁅i - 1⁆, words⁅i⁆, rank) > 0 {
            return false
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro isAlienSorted(self, words: ArrayList<utf8>, order: utf8): bool {
        return isAlienSorted(words, order)
    }
}
