namespace leetcode.shortest_word_distance;

# 一次顺序扫描：记录 word1 / word2 最近一次出现的位置，位置差就是候选答案。
[export(case: "camelCase")]
micro shortestDistance(wordsDict: ArrayList<utf8>, word1: utf8, word2: utf8) -> i64 {
    let mut last1: i64 = 0 - 1
    let mut last2: i64 = 0 - 1
    let mut best: i64 = wordsDict.length() as i64
    let mut i: usize = 0
    while i < wordsDict.length() {
        let word: utf8 = wordsDict⁅i⁆
        if word.equals(word1) {
            last1 = i as i64
        }
        if word.equals(word2) {
            last2 = i as i64
        }
        if last1 >= 0 && last2 >= 0 {
            let mut gap: i64 = last1 - last2
            if gap < 0 {
                gap = 0 - gap
            }
            if gap < best {
                best = gap
            }
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro shortestDistance(self, wordsDict: ArrayList<utf8>, word1: utf8, word2: utf8): i64 {
        return shortestDistance(wordsDict, word1, word2)
    }
}
