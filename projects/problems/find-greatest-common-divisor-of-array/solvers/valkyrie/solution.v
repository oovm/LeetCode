namespace leetcode.find_greatest_common_divisor_of_array;

class Solution {
    micro findGCD(self, nums: ArrayList<i64>): i64 {
        let mut min_val: i64 = nums⁅1⁆.unwrap()
        let mut max_val: i64 = nums⁅1⁆.unwrap()
        let mut i: usize = 2
        while i <= nums.length() {
            let v: i64 = nums⁅i⁆.unwrap()
            if v < min_val {
                min_val = v
            }
            if v > max_val {
                max_val = v
            }
            i = i + 1
        }
        return gcd(min_val, max_val)
    }

    micro gcd(self, a: i64, b: i64): i64 {
        let mut x: i64 = a
        let mut y: i64 = b
        while y != 0 {
            let temp: i64 = y
            y = x % y
            x = temp
        }
        return x
    }
}
