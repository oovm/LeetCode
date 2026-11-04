namespace leetcode.shortest_completing_word;

using std.collection;

# 牌照只保留小写字母后的频次表；候选词先建自身频次表，再逐字母核对「不缺」，
# 同长择优只需比较 length，无需任何排序。
# 题内触发点: G17 —— 频次表以 `char` 作键，而 `char` 没有 `Hash` impl；
# 本题与 `find-resultant-array-after-removing-anagrams` 同批第二个 `char` 作键实例。
# 字母筛选走 `to_lower` + `as u32` 码位区间，绕开 `char` 无 `<`（G15）的比较面。
micro letter_counts(text: utf8) -> HashMap<char, i64> {
    let count: usize = text.length()
    let mut counts: HashMap<char, i64> = HashMap::new(count)
    let mut i: usize = 0
    while i < count {
        let letter: char = text⁅i⁆
        let mut seen: i64 = 0
        if counts.contains_key(letter) {
            seen = counts.get(letter).unwrap()
        }
        counts.insert(letter, seen + 1)
        i = i + 1
    }
    return counts
}

micro covers(word: utf8, required: ArrayList<char>, need: HashMap<char, i64>) -> bool {
    let have: HashMap<char, i64> = letter_counts(word)
    let mut i: usize = 0
    while i < required.length() {
        let letter: char = required⁅i⁆
        let want: i64 = need.get(letter).unwrap()
        let mut got: i64 = 0
        if have.contains_key(letter) {
            got = have.get(letter).unwrap()
        }
        if got < want {
            return false
        }
        i = i + 1
    }
    return true
}

[export(case: "camelCase")]
micro shortest_completing_word(licensePlate: utf8, words: ArrayList<utf8>) -> utf8 {
    let plate: utf8 = licensePlate.to_lower()
    let plate_count: usize = plate.length()
    let mut need: HashMap<char, i64> = HashMap::new(plate_count)
    let mut i: usize = 0
    while i < plate_count {
        let letter: char = plate⁅i⁆
        let code: u32 = letter as u32
        if code >= 97 && code <= 122 {
            let mut seen: i64 = 0
            if need.contains_key(letter) {
                seen = need.get(letter).unwrap()
            }
            need.insert(letter, seen + 1)
        }
        i = i + 1
    }

    let required: ArrayList<char> = need.keys()
    let mut best: utf8 = ""
    let mut found: bool = false
    i = 0
    while i < words.length() {
        let word: utf8 = words⁅i⁆
        if covers(word, required, need) {
            if !found || word.length() < best.length() {
                best = word
                found = true
            }
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro shortestCompletingWord(self, licensePlate: utf8, words: ArrayList<utf8>): utf8 {
        return shortest_completing_word(licensePlate, words)
    }
}
