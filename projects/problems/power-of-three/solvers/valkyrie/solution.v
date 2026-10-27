namespace leetcode.power_of_three;

class Solution {
    micro isPowerOfThree(self, n: i64): bool {
        if n <= 0 {
            return false
        }
        let mut num: i64 = n
        while num > 1 {
            if num % 3 != 0 {
                return false
            }
            num = num / 3
        }
        return true
    }
}
