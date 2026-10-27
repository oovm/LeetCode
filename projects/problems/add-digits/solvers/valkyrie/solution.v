namespace leetcode.add_digits;

class Solution {
    micro addDigits(self, num: i64): i64 {
        if num == 0 {
            return 0
        }
        return 1 + ((num - 1) % 9)
    }
}
