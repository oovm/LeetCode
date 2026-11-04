namespace leetcode.number_of_sub_arrays_with_odd_sum;

using std.collection;

# 前缀奇偶计数：当前前缀为奇时，之前每个偶前缀都构成一个奇数和的子数组。
# 当前前缀为偶时，之前每个奇前缀都构成一个奇数和的子数组。
[export(case: "camelCase")]
micro numOfSubarrays(arr: ArrayList<i64>) -> i64 {
    let mut even_prefixes: i64 = 1
    let mut odd_prefixes: i64 = 0
    let mut parity: i64 = 0
    let mut total: i64 = 0
    loop value in arr {
        if value % 2 != 0 {
            parity = 1 - parity
        }
        if parity == 1 {
            total = total + even_prefixes
            odd_prefixes = odd_prefixes + 1
        } else {
            total = total + odd_prefixes
            even_prefixes = even_prefixes + 1
        }
    }
    return total % 1000000007
}

class Solution {
    micro numOfSubarrays(self, arr: ArrayList<i64>): i64 {
        return numOfSubarrays(arr)
    }
}
