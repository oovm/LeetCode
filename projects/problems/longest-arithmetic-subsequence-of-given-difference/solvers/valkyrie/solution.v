namespace leetcode.longest_arithmetic_subsequence_of_given_difference;

using std.collection;

# 哈希记录「以值 v 结尾的最长等差子序列长度」，每个元素只需查 `v - difference`，O(n)。
[export(case: "camelCase")]
micro longestSubsequence(arr: ArrayList<i64>, difference: i64) -> i64 {
    let mut lengths: HashMap<i64, i64> = HashMap::new(arr.length())
    let mut best: i64 = 1
    let mut i: usize = 0
    while i < arr.length() {
        let value: i64 = arr⁅i⁆
        let previous: i64 = value - difference
        let mut length: i64 = 1
        if lengths.contains_key(previous) {
            length = lengths.get(previous).unwrap() + 1
        }
        lengths.insert(value, length)
        if length > best {
            best = length
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro longestSubsequence(self, arr: ArrayList<i64>, difference: i64): i64 {
        return longestSubsequence(arr, difference)
    }
}
