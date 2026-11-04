namespace leetcode.sentence_similarity_ii;

using std.collection;

# 并查集先把同义对的词合并成连通分量，再逐词检查两句对应词是否同属一个分量。
[export(case: "camelCase")]
micro areSentencesSimilarTwo(sentence1: ArrayList<utf8>, sentence2: ArrayList<utf8>, similarPairs: ArrayList<ArrayList<utf8>>) -> bool {
    if sentence1.length() != sentence2.length() {
        return false
    }

    let mut sets: DisjointSet<i64> = DisjointSet::new()
    let mut ids: HashMap<utf8, i64> = HashMap::new(similarPairs.length() * 2)
    let mut next_id: i64 = 0

    let mut i: usize = 0
    while i < similarPairs.length() {
        let pair: ArrayList<utf8> = similarPairs⁅i⁆
        let left: utf8 = pair⁅0⁆
        let right: utf8 = pair⁅1⁆
        if !ids.contains_key(left) {
            ids.insert(left, next_id)
            next_id = next_id + 1
        }
        if !ids.contains_key(right) {
            ids.insert(right, next_id)
            next_id = next_id + 1
        }
        sets.union(ids.get(left).unwrap(), ids.get(right).unwrap())
        i = i + 1
    }

    let mut k: usize = 0
    while k < sentence1.length() {
        let first: utf8 = sentence1⁅k⁆
        let second: utf8 = sentence2⁅k⁆
        if first == second {
            k = k + 1
            continue
        }
        if !ids.contains_key(first) || !ids.contains_key(second) {
            return false
        }
        if !sets.connected(ids.get(first).unwrap(), ids.get(second).unwrap()) {
            return false
        }
        k = k + 1
    }
    return true
}

class Solution {
    micro areSentencesSimilarTwo(self, sentence1: ArrayList<utf8>, sentence2: ArrayList<utf8>, similarPairs: ArrayList<ArrayList<utf8>>): bool {
        return areSentencesSimilarTwo(sentence1, sentence2, similarPairs)
    }
}
