namespace leetcode.longest_turbulent_subarray;

using std.collection;

# 记录上一次比较的方向，方向交替就延长，方向相同或相等就重置，一趟 O(n)。
[export(case: "camelCase")]
micro maxTurbulenceSize(arr: [i64]) -> i64 {
    let count: usize = arr.length()
    let mut best: i64 = 1
    let mut run: i64 = 1
    let mut previous_sign: i64 = 0
    let mut i: usize = 1
    while i < count {
        let difference: i64 = arr⁅i⁆ - arr⁅i - 1⁆
        let mut sign: i64 = 0
        if difference > 0 {
            sign = 1
        }
        if difference < 0 {
            sign = 0 - 1
        }
        if sign == 0 {
            run = 1
        } else if previous_sign == 0 || sign == previous_sign {
            run = 2
        } else {
            run = run + 1
        }
        if run > best {
            best = run
        }
        previous_sign = sign
        i = i + 1
    }
    return best
}

class Solution {
    micro maxTurbulenceSize(self, arr: [i64]): i64 {
        return maxTurbulenceSize(arr)
    }
}
