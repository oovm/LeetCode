namespace leetcode.minimum_number_of_operations_to_reinitialize_a_permutation;

# 跟踪位置 1 的循环长度：perm 映射偶数 i→i/2，奇数 i→n/2+(i-1)/2。
[export(case: "camelCase")]
micro reinitialize_permutation(n: i64) -> i64 {
    let mut position: i64 = 1
    let mut count: i64 = 0
    while true {
        if position % 2 == 0 {
            position = position / 2
        } else {
            position = n / 2 + (position - 1) / 2
        }
        count = count + 1
        if position == 1 {
            return count
        }
    }
    return 0
}

class Solution {
    micro reinitializePermutation(self, n: i64): i64 {
        return reinitialize_permutation(n)
    }
}
