namespace leetcode.sequential_digits;

# 按位数递增、首位递增枚举连续递增数字串。
[export(case: "camelCase")]
micro sequential_digits(low: i64, high: i64) -> [i64] {
    let mut answer: ArrayList<i64> = ArrayList::new(0)
    let mut width: i64 = 2
    while width <= 10 {
        let mut start: i64 = 1
        while start <= 10 - width {
            let mut value: i64 = 0
            let mut digit: i64 = start
            while digit < start + width {
                value = value * 10 + digit
                digit = digit + 1
            }
            if value >= low && value <= high {
                answer.push(value)
            }
            start = start + 1
        }
        width = width + 1
    }
    return answer.to_array()
}

class Solution {
    micro sequentialDigits(self, low: i64, high: i64): [i64] {
        return sequential_digits(low, high)
    }
}
