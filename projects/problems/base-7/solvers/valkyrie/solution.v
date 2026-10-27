namespace leetcode.base_7;

class Solution {
    micro convertToBase7(self, num: i64): i64 {
        if num == 0 {
            return 0
        }
        let mut n: i64 = num
        let mut negative: bool = false
        if n < 0 {
            negative = true
            n = -n
        }
        let mut result: i64 = 0
        let mut place: i64 = 1
        while n > 0 {
            let digit: i64 = n % 7
            result = result + digit * place
            n = n / 7
            place = place * 10
        }
        if negative {
            return -result
        }
        return result
    }
}
