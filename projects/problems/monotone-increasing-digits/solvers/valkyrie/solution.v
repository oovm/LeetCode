namespace leetcode.monotone_increasing_digits;

# 纯算术贪心（不依赖数组）：从最右相邻位向左扫，发现「右位 < 左位」递减时，
# 把左位减 1、其右全部置 9，再从最右复查，直到整个数单调不减。
[export(case: "camelCase")]
micro monotone_increasing_digits(n: i64) -> i64 {
    let mut num: i64 = n
    let mut step: i64 = 1
    while step * 10 <= num {
        let high: i64 = (num / (step * 10)) % 10
        let low: i64 = (num / step) % 10
        if low < high {
            num = (num / (step * 10) - 1) * (step * 10) + (step * 10 - 1)
            step = 1
        } else {
            step = step * 10
        }
    }
    return num
}

class Solution {
    micro monotoneIncreasingDigits(self, n: i64): i64 {
        return monotone_increasing_digits(n)
    }
}
