namespace leetcode.solution

using std.collection

# 题内触发点: 全表异或后，最少翻转次数 = `(xor(nums) ^ k)` 的置位数。
micro popcount(value: i64) -> i64 {
    let mut current: i64 = value
    let mut count: i64 = 0
    while current > 0 {
        count = count + (current & 1)
        current = current >> 1
    }
    return count
}

class Solution {
    [export(case: "camelCase")]
    micro minOperations(nums: [i64], k: i64) -> i64 {
        let mut total: i64 = 0
        loop value in nums {
            total = total ^ value
        }
        return popcount(total ^ k)
    }
}
