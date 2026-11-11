namespace leetcode.longest_harmonious_subsequence;

using std.collection;

# 和谐子序列只由「相差 1」的两个值组成：频次表 + 遍历键找相邻值，时间 O(n)、空间 O(n)。
[export(case: "camelCase")]
micro findLHS(nums: [i64]) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(nums.length())
    loop value in nums {
        let mut next: i64 = 1
        if counts.contains_key(value) {
            next = counts.get(value).unwrap() + 1
        }
        counts.insert(value, next)
    }

    let keys: ArrayList<i64> = counts.keys()
    let mut best: i64 = 0
    let mut i: usize = 0
    while i < keys.length() {
        let value: i64 = keys⁅i⁆
        if counts.contains_key(value + 1) {
            let total: i64 = counts.get(value).unwrap() + counts.get(value + 1).unwrap()
            if total > best {
                best = total
            }
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro findLHS(self, nums: [i64]): i64 {
        return findLHS(nums)
    }
}
