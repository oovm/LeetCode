namespace leetcode.power_of_two;

class Solution {
    micro isPowerOfTwo(self, n: i64): bool {
        if n <= 0 {
            return false
        }
        let mut num: i64 = n
        while num > 1 {
            if num % 2 != 0 {
                return false
            }
            num = num / 2
        }
        return true
    }
}
