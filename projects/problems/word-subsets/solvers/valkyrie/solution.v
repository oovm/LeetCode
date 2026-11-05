namespace leetcode.word_subsets;

using std.collection;

# char 作频次键需要 Hash，std 尚未实现（G17）；有序/比较面见 G15。
micro count_chars(word: utf8) -> HashMap<char, i64> {
    let mut counts: HashMap<char, i64> = HashMap::new(word.length())
    loop character in word {
        if counts.contains_key(character) {
            let current: i64 = counts.get(character).unwrap()
            counts.insert(character, current + 1)
        } else {
            counts.insert(character, 1)
        }
    }
    return counts
}

micro meets(word: utf8, maxima: HashMap<char, i64>) -> bool {
    let counts: HashMap<char, i64> = count_chars(word)
    let keys: ArrayList<char> = maxima.keys()
    let mut i: usize = 0
    while i < keys.length() {
        let character: char = keys⁅i⁆
        let needed: i64 = maxima.get(character).unwrap()
        let mut available: i64 = 0
        if counts.contains_key(character) {
            available = counts.get(character).unwrap()
        }
        if available < needed {
            return false
        }
        i = i + 1
    }
    return true
}

[export(case: "camelCase")]
micro word_subsets(words1: ArrayList<utf8>, words2: ArrayList<utf8>) -> ArrayList<utf8> {
    let mut maxima: HashMap<char, i64> = HashMap::new(words2.length())
    loop word in words2 {
        let counts: HashMap<char, i64> = count_chars(word)
        let keys: ArrayList<char> = counts.keys()
        let mut i: usize = 0
        while i < keys.length() {
            let character: char = keys⁅i⁆
            let needed: i64 = counts.get(character).unwrap()
            if !maxima.contains_key(character) || maxima.get(character).unwrap() < needed {
                maxima.insert(character, needed)
            }
            i = i + 1
        }
    }

    let mut result: ArrayList<utf8> = ArrayList::new(words1.length())
    loop word in words1 {
        if meets(word, maxima) {
            result.push(word)
        }
    }
    return result
}

class Solution {
    micro wordSubsets(self, words1: ArrayList<utf8>, words2: ArrayList<utf8>): ArrayList<utf8> {
        return word_subsets(words1, words2)
    }
}
