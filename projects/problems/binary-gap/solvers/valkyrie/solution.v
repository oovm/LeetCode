namespace leetcode.binary_gap;

class Solution {
    micro binaryGap(self, n: i64): i64 {
        let mut max_gap: i64 = 0
        let mut last_one: i64 = -1
        let mut pos: i64 = 0
        let mut num: i64 = n
        while num > 0 {
            let bit: i64 = num & 1
            if bit == 1 {
                if last_one >= 0 {
                    let gap: i64 = pos - last_one
                    if gap > max_gap {
                        max_gap = gap
                    }
                }
                last_one = pos
            }
            num = num >> 1
            pos = pos + 1
        }
        return max_gap
    }
}
