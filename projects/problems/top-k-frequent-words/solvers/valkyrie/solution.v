namespace leetcode.top_k_frequent_words;

using std.collection;

# `utf8` 的字典序由 `Utf8Text` 的 `Comparable` 合同提供，
# 这里只把 `Ordering` 经 `natural_order` 转成 `i32`。
micro compare_text(left: utf8, right: utf8) -> i32 {
    return natural_order(left, right)
}

# 临时绕过（复核于 addon `25132ccf`，2026-11-05）：真写法是 `HashMap<utf8, i64>` 计数 +
# `sorted_by(bucket, compare_text)` 排序。两处在该 addon 上均阻断：
# `HashMap<utf8, _>` → `WASM ABI carrier mismatch in std::insert: slot=i32 actual=anyref operand=%1 (Utf8)`
# `sorted_by(utf8)` → `WASM ABI carrier mismatch in std::collection::is_less_or_equal: slot=i32 actual=anyref operand=%0 (Utf8)`
# 因此保留「词表 + 计数表」线性计数，桶内改用就地插入排序（比较器仍是 `compare_text`）。

# 桶内就地插入排序：稳定，按 `compare_text` 升序。
micro sort_texts(mut items: ArrayList<utf8>) -> unit {
    let count: usize = items.length()
    let mut i: usize = 1
    while i < count {
        let current: utf8 = items⁅i⁆
        let mut j: usize = i
        while j > 0 {
            let previous: utf8 = items⁅j - 1⁆
            if compare_text(previous, current) <= 0 {
                break
            }
            items.set((j + 1) as isize, previous)
            j = j - 1
        }
        items.set((j + 1) as isize, current)
        i = i + 1
    }
}

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
            if distinct⁅slot⁆ == word {
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
            sort_texts(bucket)
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
