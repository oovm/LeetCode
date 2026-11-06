namespace leetcode.solution

using std.collection

# 枚举起点，再按步长 2 向右扩展：每次扩展得到的是一个新的奇数长度子数组，
# 累加当前窗口和即可一次走完所有奇数长度区间。
class Solution {
    [export(case: "camelCase")]
    micro sumOddLengthSubarrays(arr: ArrayList<i64>) -> i64 {
        let count: usize = arr.length()
        let mut total: i64 = 0
        let mut start: usize = 0
        while start < count {
            let mut window: i64 = 0
            let mut index: usize = start
            while index < count {
                window = window + arr⁅index⁆
                total = total + window
                index = index + 2
            }
            start = start + 1
        }
        return total
    }
}
