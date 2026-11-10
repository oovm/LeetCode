namespace leetcode.rotate_function;

using std.collection;

# 数学递推：F(k+1) = F(k) + sum - n * nums[n-1-k]；O(n) 扫一遍。
[export(case: "camelCase")]
micro maxRotateFunction(nums: ArrayList<i64>) -> i64 {
    let n: usize = nums.length()
    if n == 0 {
        return 0
    }
    let mut sum: i64 = 0
    let mut current: i64 = 0
    let mut i: usize = 0
    while i < n {
        sum = sum + nums⁅i⁆
        current = current + nums⁅i⁆ * i as i64
        i = i + 1
    }
    let mut best: i64 = current
    let mut k: usize = 1
    while k < n {
        current = current + sum - nums⁅n as usize - k⁆ * n as i64
        if current > best {
            best = current
        }
        k = k + 1
    }
    return best
}

class Solution {
    micro maxRotateFunction(self, nums: ArrayList<i64>): i64 {
        return maxRotateFunction(nums)
    }
}
