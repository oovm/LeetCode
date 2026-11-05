namespace leetcode.short_encoding_of_words;

using std.collection;

# 所有单词倒序插入字典树，根到叶的路径长度之和即最短编码总长。
[export(case: "camelCase")]
micro minimum_length_encoding(words: ArrayList<utf8>) -> i64 {
    let mut edges: HashMap<i64, i64> = HashMap::new(words.length() * 8 + 1)
    let mut depth: ArrayList<i64> = ArrayList::new(words.length() + 1)
    let mut kids: ArrayList<i64> = ArrayList::new(words.length() + 1)
    depth.push(0)
    kids.push(0)
    let mut nodes: i64 = 1
    let mut index: usize = 0
    while index < words.length() {
        let word: utf8 = words⁅index⁆
        let mut node: i64 = 0
        let mut cursor: i64 = word.byte_length() as i64 - 1
        while cursor >= 0 {
            let code: i64 = word.byte_at(cursor as usize) as i64 - 97
            let edge: i64 = node * 26 + code
            if edges.contains_key(edge) {
                node = edges.get(edge).unwrap()
            } else {
                let parent: i64 = node
                edges.insert(edge, nodes)
                depth.push(depth⁅parent as usize⁆ + 1)
                kids.push(0)
                kids⁅parent as usize⁆ = kids⁅parent as usize⁆ + 1
                node = nodes
                nodes = nodes + 1
            }
            cursor = cursor - 1
        }
        index = index + 1
    }
    let mut total: i64 = 0
    let mut id: i64 = 1
    while id < nodes {
        if kids⁅id as usize⁆ == 0 {
            total = total + depth⁅id as usize⁆ + 1
        }
        id = id + 1
    }
    return total
}

class Solution {
    micro minimumLengthEncoding(self, words: ArrayList<utf8>): i64 {
        return minimum_length_encoding(words)
    }
}
