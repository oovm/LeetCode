namespace leetcode.minimum_operations_to_make_array_equal;

# arr[i] = 2i+1，全部拉平到均值的操作数 = ⌊n²/4⌋（n 为奇数时 n² ≡ 1 mod 4，整除天然取下整）。
[export(case: "camelCase")]
micro min_operations(n: i64) -> i64 {
    return n * n / 4
}

class Solution {
    micro minOperations(self, n: i64): i64 {
        return min_operations(n)
    }
}
