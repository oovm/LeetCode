namespace leetcode.top_k_frequent_words;

using std.collection;

# `utf8` 的字典序比较器（std 的 `utf8` 虽有 `Comparable`，但跨闭包消费点尚未验证）。
micro compare_text(left: utf8, right: utf8) -> i32 {
    let left_length: usize = left.length()
    let right_length: usize = right.length()
    let mut index: usize = 0
    while index < left_length && index < right_length {
        let left_code: u32 = left⁅index⁆ as u32
        let right_code: u32 = right⁅index⁆ as u32
        if left_code < right_code {
            return -1
        }
        if left_code > right_code {
            return 1
        }
        index = index + 1
    }
    if left_length < right_length {
        return -1
    }
    if left_length > right_length {
        return 1
    }
    return 0
}

micro equal_text(left: utf8, right: utf8) -> bool {
    if left.length() != right.length() {
        return false
    }
    let mut index: usize = 0
    while index < left.length() {
        if (left⁅index⁆ as u32) != (right⁅index⁆ as u32) {
            return false
        }
        index = index + 1
    }
    return true
}

# 关键字排序：频次降序为第一维（按桶从高到低取），同频次内字典序升序（`sorted_by`）。
# `HashMap<utf8, i64>` 在本批 addon 上仍不可编译（`std::hash` 合同实例未进依赖导入），
# 因此词频用「词表 + 计数表」线性查找；真写法是 `HashMap<utf8, i64>`。
[export(case: "camelCase")]
micro top_k_frequent(words: ArrayList<utf8>, k: i64) -> ArrayList<utf8> {
    let total: usize = words.length()
    let mut distinct: ArrayList<utf8> = ArrayList::new(total)
    let mut counts: ArrayList<i64> = ArrayList::new(total)

    let mut index: usize = 0
    while index < total {
        let word: utf8 = words⁅index⁆
        let mut slot: usize = 0
        let mut found: bool = false
        while slot < distinct.length() {
            if equal_text(distinct⁅slot⁆, word) {
                counts⁅slot⁆ = counts⁅slot⁆ + 1
                found = true
            }
            slot = slot + 1
        }
        if !found {
            distinct.push(word)
            counts.push(1)
        }
        index = index + 1
    }

    let mut buckets: ArrayList<ArrayList<utf8>> = ArrayList::new(total + 1)
    let mut bucket_index: usize = 0
    while bucket_index <= total {
        buckets.push(ArrayList::new(0))
        bucket_index = bucket_index + 1
    }

    let mut cursor: usize = 0
    while cursor < distinct.length() {
        let frequency: i64 = counts⁅cursor⁆
        let mut bucket: ArrayList<utf8> = buckets⁅frequency as usize⁆
        bucket.push(distinct⁅cursor⁆)
        buckets.set((frequency as usize + 1) as isize, bucket)
        cursor = cursor + 1
    }

    let take: usize = k as usize
    let mut result: ArrayList<utf8> = ArrayList::new(take)
    let mut frequency: usize = total
    while frequency > 0 && result.length() < take {
        let mut bucket: ArrayList<utf8> = buckets⁅frequency⁆
        if bucket.length() > 0 {
            bucket = sorted_by(bucket, compare_text)
            let mut slot: usize = 0
            while slot < bucket.length() && result.length() < take {
                result.push(bucket⁅slot⁆)
                slot = slot + 1
            }
        }
        frequency = frequency - 1
    }
    return result
}

class Solution {
    micro topKFrequent(self, words: ArrayList<utf8>, k: i64): ArrayList<utf8> {
        return top_k_frequent(words, k)
    }
}
