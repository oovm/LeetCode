namespace leetcode.monotonic_array;

[export(case: "camelCase")]
micro is_monotonic(nums: ArrayList<i64>) -> bool {
    let n: usize = nums.length()
    let mut inc: bool = true
    let mut dec: bool = true
    let mut i: usize = 0
    while i + 1 < n {
        let a: i64 = nums⁅i⁆
        let b: i64 = nums⁅i + 1⁆
        if a < b {
            dec = false
        }
        if a > b {
            inc = false
        }
        i = i + 1
    }
    return inc || dec
}

class Solution {
    micro isMonotonic(self, nums: ArrayList<i64>): bool {
        return is_monotonic(nums)
    }
}
