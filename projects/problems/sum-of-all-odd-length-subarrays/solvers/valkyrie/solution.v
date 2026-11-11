namespace leetcode.solution

using std.collection

# 枚举起点与奇数长度：每个奇数长度窗口都要把窗口内全部元素计入，
# 不能按步长 2 只累加同奇偶位置。
class Solution {
    [export(case: "camelCase")]
    micro sumOddLengthSubarrays(arr: [i64]) -> i64 {
        let count: usize = arr.length()
        let mut total: i64 = 0
        let mut start: usize = 0
        while start < count {
            let mut span: usize = 1
            while start + span <= count {
                let mut offset: usize = 0
                while offset < span {
                    total = total + arr⁅start + offset⁆
                    offset = offset + 1
                }
                span = span + 2
            }
            start = start + 1
        }
        return total
    }
}
