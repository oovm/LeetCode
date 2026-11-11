namespace leetcode.kth_missing_positive_number;

using std.collection;

# 顺序推进正整数，遇到数组元素就消耗掉，累计到第 k 个缺失值即答案。
[export(case: "camelCase")]
micro findKthPositive(arr: [i64], k: i64) -> i64 {
    let mut missing: i64 = 0
    let mut current: i64 = 1
    let mut index: usize = 0
    while index < arr.length() {
        if arr⁅index⁆ == current {
            index = index + 1
            current = current + 1
        } else {
            missing = missing + 1
            if missing == k {
                return current
            }
            current = current + 1
        }
    }
    while missing < k {
        missing = missing + 1
        if missing == k {
            return current
        }
        current = current + 1
    }
    return current
}

class Solution {
    micro findKthPositive(self, arr: [i64], k: i64): i64 {
        return findKthPositive(arr, k)
    }
}
