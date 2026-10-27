namespace leetcode.self_dividing_numbers;

class Solution {
    micro selfDividingNumbers(self, left: i64, right: i64): ArrayList<i64> {
        let mut result: ArrayList<i64> = ArrayList::new(0)
        let mut n: i64 = left
        while n <= right {
            if isSelfDividing(n) {
                result.push(n)
            }
            n = n + 1
        }
        return result
    }

    micro isSelfDividing(self, n: i64): bool {
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
}
