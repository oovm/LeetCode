namespace leetcode.count_odd_numbers_in_an_interval_range;

class Solution {
    micro countOdds(self, low: i64, high: i64): i64 {
        let range: i64 = high - low + 1
        if low % 2 == 0 {
            return range / 2
        }
        return range / 2 + range % 2
    }
}
