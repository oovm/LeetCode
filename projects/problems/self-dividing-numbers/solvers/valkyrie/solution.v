namespace leetcode.self_dividing_numbers;

micro is_self_dividing(n: i64) -> bool {
    let mut num: i64 = n
    while num > 0 {
        let digit: i64 = num % 10
        if digit == 0 {
            return false
        }
        if n % digit != 0 {
            return false
        }
        num = num / 10
    }
    return true
}

[export(case: "camelCase")]
micro self_dividing_numbers(left: i64, right: i64) -> ArrayList<i64> {
    let mut result: ArrayList<i64> = ArrayList::new(0)
    let mut n: i64 = left
    while n <= right {
        if is_self_dividing(n) {
            result.push(n)
        }
        n = n + 1
    }
    return result
}

class Solution {
    micro selfDividingNumbers(self, left: i64, right: i64): ArrayList<i64> {
        return self_dividing_numbers(left, right)
    }
}
