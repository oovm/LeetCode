namespace leetcode.find_words_that_can_be_formed_by_characters;

using std.collection;

# char 作频次键需要 Hash（G17）；chars 与每个 word 都按字符计数。
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

[export(case: "camelCase")]
micro find_words_that_can_be_formed(words: ArrayList<utf8>, chars: utf8) -> i64 {
    let available: HashMap<char, i64> = count_chars(chars)
    let mut total: i64 = 0
    loop word in words {
        let need: HashMap<char, i64> = count_chars(word)
        let keys: ArrayList<char> = need.keys()
        let mut usable: bool = true
        let mut i: usize = 0
        while i < keys.length() {
            let character: char = keys⁅i⁆
            if !available.contains_key(character) {
                usable = false
            } else if available.get(character).unwrap() < need.get(character).unwrap() {
                usable = false
            }
            i = i + 1
        }
        if usable {
            total = total + word.length() as i64
        }
    }
    return total
}

class Solution {
    micro countCharacters(self, words: ArrayList<utf8>, chars: utf8): i64 {
        return find_words_that_can_be_formed(words, chars)
    }
}
