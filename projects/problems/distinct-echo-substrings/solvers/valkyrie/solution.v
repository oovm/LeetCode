namespace leetcode.distinct_echo_substrings;

using std.collection;
using std.text;

# 滚动哈希 `[left, right]` 闭区间的哈希值：前缀和相减后回正。
micro window_hash(prefix: ArrayList<i64>, power: ArrayList<i64>, left: usize, right: usize, modulus: i64) -> i64 {
    let span: usize = right - left + 1
    let high: i64 = prefix⁅right + 1⁆
    let low: i64 = prefix⁅left⁆ * power⁅span⁆ % modulus
    let difference: i64 = (high - low) % modulus
    if difference < 0 {
        return difference + modulus
    }
    return difference
}

# 枚举前半段 `[i, middle]` 与后半段 `[middle + 1, j]`，用前缀哈希 O(1) 比较；
# 相等的半段文本以哈希值放进集合去重，答案即集合大小。
[export(case: "camelCase")]
micro distinctEchoSubstrings(text: utf8) -> i64 {
    let length: usize = text.length()
    let modulus: i64 = 1000000007
    let base: i64 = 131

    let mut prefix: ArrayList<i64> = ArrayList::new(length + 1)
    let mut power: ArrayList<i64> = ArrayList::new(length + 1)
    prefix.push(0)
    power.push(1)
    let mut i: usize = 0
    while i < length {
        let code: i64 = text⁅i⁆ as u32 as i64
        prefix.push((prefix⁅i⁆ * base % modulus + code + 1) % modulus)
        power.push(power⁅i⁆ * base % modulus)
        i = i + 1
    }

    let mut seen: HashSet<i64> = HashSet::new()
    i = 0
    while i + 1 < length {
        let mut j: usize = i + 1
        while j < length {
            let middle: usize = (i + j) / 2
            let left_hash: i64 = window_hash(prefix, power, i, middle, modulus)
            let right_hash: i64 = window_hash(prefix, power, middle + 1, j, modulus)
            if left_hash == right_hash {
                seen.insert(left_hash)
            }
            j = j + 2
        }
        i = i + 1
    }
    return seen.length() as i64
}

class Solution {
    micro distinctEchoSubstrings(self, text: utf8): i64 {
        return distinctEchoSubstrings(text)
    }
}
