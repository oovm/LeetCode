namespace leetcode.shortest_word_distance_iii;

using std.collection;

# 单遍扫描：分别记录 word1/word2 最近下标；同词时要求两个下标不同。
[export(case: "camelCase")]
micro shortestWordDistance(wordsDict: ArrayList<utf8>, word1: utf8, word2: utf8) -> i64 {
    let mut last1: i64 = -1
    let mut last2: i64 = -1
    let mut best: i64 = wordsDict.length() as i64
    let mut i: usize = 0
    while i < wordsDict.length() {
        if wordsDict⁅i⁆ == word2 {
            if word1 == word2 && last1 != -1 && i as i64 - last1 < best {
                best = i as i64 - last1
            }
            last2 = i as i64
        }
        if wordsDict⁅i⁆ == word1 {
            if last2 != -1 && i as i64 - last2 < best {
                best = i as i64 - last2
            }
            last1 = i as i64
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro shortestWordDistance(self, wordsDict: ArrayList<utf8>, word1: utf8, word2: utf8): i64 {
        return shortestWordDistance(wordsDict, word1, word2)
    }
}
