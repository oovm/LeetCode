namespace leetcode.maximum_difference_between_increasing_elements;

class Solution {
    micro maximumDifference(self, nums: ArrayList<i64>): i64 {
        let mut max_diff: i64 = -1
        let mut i: usize = 1
        while i <= nums.length() {
            let j: usize = i + 1
            while j <= nums.length() {
                let ni: i64 = nums⁅i⁆.unwrap()
                let nj: i64 = nums⁅j⁆.unwrap()
                if nj > ni {
                    let diff: i64 = nj - ni
                    if diff > max_diff {
                        max_diff = diff
                    }
                }
                j = j + 1
            }
            i = i + 1
        }
        return max_diff
    }
}
