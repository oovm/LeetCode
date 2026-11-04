namespace leetcode.three_consecutive_odds

# 线性扫描窗口长度为 3 的连续奇数列。
[export(case: "camelCase")]
micro threeConsecutiveOdds(arr: ArrayList<i64>) -> bool {
    let count: usize = arr.length()
    let mut i: usize = 0
    while i + 2 < count {
        let a: i64 = arr⁅i⁆
        let next: usize = i + 1
        let b: i64 = arr⁅next⁆
        let third: usize = i + 2
        let c: i64 = arr⁅third⁆
        if a % 2 == 1 && b % 2 == 1 && c % 2 == 1 {
            return true
        }
        i = i + 1
    }
    return false
}

class Solution {
    micro threeConsecutiveOdds(self, arr: ArrayList<i64>): bool {
        return threeConsecutiveOdds(arr)
    }
}
