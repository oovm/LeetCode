namespace leetcode.finding_3_digit_even_numbers;

using std.collection;

# 从 100 到 998 逐个枚举偶数，用数字计数器判断三位能否由输入数字组成。
[export(case: "camelCase")]
micro findEvenNumbers(digits: ArrayList<i64>) -> ArrayList<i64> {
    let mut counts: ArrayList<i64> = ArrayList::new(10)
    let mut digit: i64 = 0
    while digit < 10 {
        counts.push(0)
        digit = digit + 1
    }
    loop value in digits {
        counts⁅value as usize⁆ = counts⁅value as usize⁆ + 1
    }

    let mut answer: ArrayList<i64> = ArrayList::new(900)
    let mut candidate: i64 = 100
    while candidate <= 998 {
        let hundreds: i64 = candidate / 100
        let tens: i64 = (candidate / 10) % 10
        let ones: i64 = candidate % 10

        let mut available: ArrayList<i64> = ArrayList::new(10)
        let mut copy: i64 = 0
        while copy < 10 {
            available.push(counts⁅copy as usize⁆)
            copy = copy + 1
        }

        let mut usable: bool = true
        if available⁅hundreds as usize⁆ <= 0 {
            usable = false
        } else {
            available⁅hundreds as usize⁆ = available⁅hundreds as usize⁆ - 1
        }
        if usable {
            if available⁅tens as usize⁆ <= 0 {
                usable = false
            } else {
                available⁅tens as usize⁆ = available⁅tens as usize⁆ - 1
            }
        }
        if usable {
            if available⁅ones as usize⁆ <= 0 {
                usable = false
            } else {
                available⁅ones as usize⁆ = available⁅ones as usize⁆ - 1
            }
        }
        if usable {
            answer.push(candidate)
        }
        candidate = candidate + 2
    }
    return answer
}

class Solution {
    micro findEvenNumbers(self, digits: ArrayList<i64>): ArrayList<i64> {
        return findEvenNumbers(digits)
    }
}
