namespace leetcode.partition_array_for_maximum_sum;

using std.collection;

# dp[i] = 前 i 个元素的最大和；最后一段长 len 时用这一段最大值乘以 len。
[export(case: "camelCase")]
micro maxSumAfterPartitioning(arr: ArrayList<i64>, k: i64) -> i64 {
    let n: usize = arr.length()
    let mut dp: ArrayList<i64> = ArrayList::new(n + 1)
    let mut slot: usize = 0
    while slot <= n {
        dp.push(0)
        slot = slot + 1
    }

    let mut i: usize = 1
    while i <= n {
        let mut best: i64 = 0
        let mut maximum: i64 = 0
        let mut lower: usize = 0
        if i > k as usize {
            lower = i - k as usize
        }
        let mut j: usize = i
        while j > lower {
            let value: i64 = arr⁅j - 1⁆
            if value > maximum {
                maximum = value
            }
            let candidate: i64 = dp⁅j - 1⁆ + maximum * ((i - j + 1) as i64)
            if candidate > best {
                best = candidate
            }
            j = j - 1
        }
        dp⁅i⁆ = best
        i = i + 1
    }
    return dp⁅n⁆
}

class Solution {
    micro maxSumAfterPartitioning(self, arr: ArrayList<i64>, k: i64): i64 {
        return maxSumAfterPartitioning(arr, k)
    }
}
