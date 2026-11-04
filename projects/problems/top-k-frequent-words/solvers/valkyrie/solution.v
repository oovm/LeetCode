namespace leetcode.top_k_frequent_words;

using std.collection;

# 字典序比较：std 的 utf8 没有 compare，Comparable 尚未落地（G13/G15）。
micro compare_text(left: utf8, right: utf8) -> i32 {
    return left.compare(right)
}

# 频次降序、同频字典序升序；排序返回新序列，不改动原输入（G11）。
[export(case: "camelCase")]
micro top_k_frequent(words: ArrayList<utf8>, k: i64) -> ArrayList<utf8> {
    let mut counts: HashMap<utf8, i64> = HashMap::new(words.length())
    let mut distinct: ArrayList<utf8> = ArrayList::new(words.length())
    loop word in words {
        if counts.contains_key(word) {
            let current: i64 = counts.get(word).unwrap()
            counts.insert(word, current + 1)
        } else {
            counts.insert(word, 1)
            distinct.push(word)
        }
    }

    let ordered: ArrayList<utf8> = sorted_by(distinct, micro(left: utf8, right: utf8) -> i32 {
        let left_count: i64 = counts.get(left).unwrap()
        let right_count: i64 = counts.get(right).unwrap()
        if left_count > right_count {
            return -1
        }
        if left_count < right_count {
            return 1
        }
        return compare_text(left, right)
    })

    let take: usize = k as usize
    let mut result: ArrayList<utf8> = ArrayList::new(take)
    let mut i: usize = 0
    while i < take {
        result.push(ordered⁅i⁆)
        i = i + 1
    }
    return result
}

class Solution {
    micro topKFrequent(self, words: ArrayList<utf8>, k: i64): ArrayList<utf8> {
        return top_k_frequent(words, k)
    }
}
