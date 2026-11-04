namespace leetcode.top_k_frequent_words;

using std.collection;

# 字典序比较：std 的 utf8 没有 compare，Comparable 尚未落地（G13/G15），
# 按 UTF-8 字节逐字节比较（等长前缀后短者小）。
micro compare_text(left: utf8, right: utf8) -> i32 {
    let left_length: usize = left.byte_length()
    let right_length: usize = right.byte_length()
    let mut offset: usize = 0
    while offset < left_length && offset < right_length {
        let left_byte: u32 = left.byte_at(offset) as u32
        let right_byte: u32 = right.byte_at(offset) as u32
        if left_byte < right_byte {
            return -1
        }
        if left_byte > right_byte {
            return 1
        }
        offset = offset + 1
    }
    if left_length < right_length {
        return -1
    }
    if left_length > right_length {
        return 1
    }
    return 0
}

# 频次降序、同频字典序升序；不改动原输入。
# 频次桶（`freq` → 该频次的词）先从高到低出桶，桶内用命名比较器 `compare_text` 就地
# `merge_sort`，避免排序闭包捕获 `counts`（没有返回新序列的 `sorted_by`，G11）。
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

    let mut highest: i64 = 0
    loop word in distinct {
        let current: i64 = counts.get(word).unwrap()
        if current > highest {
            highest = current
        }
    }

    let mut buckets: ArrayList<ArrayList<utf8>> = ArrayList::new(highest as usize + 1)
    let mut slot: usize = 0
    while slot <= highest as usize {
        buckets.push(ArrayList::new(0))
        slot = slot + 1
    }
    loop word in distinct {
        let at: usize = counts.get(word).unwrap() as usize
        let mut bucket: ArrayList<utf8> = buckets⁅at⁆
        bucket.push(word)
        buckets.set(at, bucket)
    }

    slot = 0
    while slot < buckets.length() {
        merge_sort(buckets⁅slot⁆, compare_text)
        slot = slot + 1
    }

    let take: usize = k as usize
    let mut result: ArrayList<utf8> = ArrayList::new(take)
    let mut level: i64 = highest
    while level >= 1 && result.length() < take {
        let bucket: ArrayList<utf8> = buckets⁅level as usize⁆
        let mut i: usize = 0
        while i < bucket.length() && result.length() < take {
            result.push(bucket⁅i⁆)
            i = i + 1
        }
        level = level - 1
    }
    return result
}

class Solution {
    micro topKFrequent(self, words: ArrayList<utf8>, k: i64): ArrayList<utf8> {
        return top_k_frequent(words, k)
    }
}
