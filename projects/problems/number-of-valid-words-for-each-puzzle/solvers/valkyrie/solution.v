namespace leetcode.solution

using std.collection

# 题内触发点: 每个词压成 26 位 `i64` 掩码；谜面要求「含首字母 + 词掩码是谜面掩码的子集」。
micro letter_mask(word: utf8) -> i64 {
    let mut mask: i64 = 0
    let mut index: usize = 0
    while index < word.byte_length() {
        let code: u8 = word.byte_at(index)
        mask = mask | ((1 as i64) << ((code - 97) as i64))
        index = index + 1
    }
    return mask
}

class Solution {
    [export(case: "findNumOfValidWords")]
    micro findNumOfValidWords(words: ArrayList<utf8>, puzzles: ArrayList<utf8>) -> ArrayList<i64> {
        let masks: ArrayList<i64> = ArrayList::new(words.length())
        loop word in words {
            masks.push(letter_mask(word))
        }
        let answers: ArrayList<i64> = ArrayList::new(puzzles.length())
        loop puzzle in puzzles {
            let allowed: i64 = letter_mask(puzzle)
            let required: i64 = (1 as i64) << ((puzzle.byte_at(0) - 97) as i64)
            let mut count: i64 = 0
            loop candidate in masks {
                if (candidate & required) != 0 && (candidate & allowed) == candidate {
                    count = count + 1
                }
            }
            answers.push(count)
        }
        return answers
    }
}
