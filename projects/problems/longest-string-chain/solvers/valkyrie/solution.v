namespace leetcode.longest_string_chain;

using std.collection;

micro compare_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 长词只可能由短词插入一个字符而来，按长度排序后做 O(n²) 最长链 DP。
micro is_predecessor(short: utf8, longer: utf8) -> bool {
    if longer.length() != short.length() + 1 {
        return false
    }
    let mut si: usize = 0
    let mut li: usize = 0
    let mut skipped: i64 = 0
    while si < short.length() {
        if li >= longer.length() {
            return false
        }
        if short⁅si⁆ != longer⁅li⁆ {
            skipped = skipped + 1
        } else {
            si = si + 1
        }
        li = li + 1
    }
    if skipped > 1 {
        return false
    }
    return true
}

[export(case: "camelCase")]
micro longest_str_chain(words: ArrayList<utf8>) -> i64 {
    let count: usize = words.length()
    if count == 0 {
        return 0
    }
    let base: i64 = 100000
    let mut order: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        let key: i64 = words⁅index⁆.length() as i64 * base + index as i64
        order.push(key)
        index = index + 1
    }
    quick_sort(order, compare_i64)
    let mut dp: ArrayList<i64> = ArrayList::new(count)
    index = 0
    while index < count {
        dp.push(1)
        index = index + 1
    }
    let mut best: i64 = 1
    let mut position: usize = 1
    while position < count {
        let current: usize = (order⁅position⁆ % base) as usize
        let mut earlier: usize = 0
        while earlier < position {
            let candidate: usize = (order⁅earlier⁆ % base) as usize
            if is_predecessor(words⁅candidate⁆, words⁅current⁆) {
                let extended: i64 = dp⁅candidate⁆ + 1
                if extended > dp⁅current⁆ {
                    dp⁅current⁆ = extended
                }
            }
            earlier = earlier + 1
        }
        if dp⁅current⁆ > best {
            best = dp⁅current⁆
        }
        position = position + 1
    }
    return best
}

class Solution {
    micro longestStrChain(self, words: ArrayList<utf8>): i64 {
        return longest_str_chain(words)
    }
}
