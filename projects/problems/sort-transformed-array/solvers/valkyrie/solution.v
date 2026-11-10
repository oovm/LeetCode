namespace leetcode.sort_transformed_array;

using std.collection;

# 抛物线双指针：a>0 两端取大从尾填；a<=0 两端取小从头填；i64 下标避免减穿。
micro f(x: i64, a: i64, b: i64, c: i64) -> i64 {
    return a * x * x + b * x + c
}

[export(case: "camelCase")]
micro sortTransformedArray(nums: ArrayList<i64>, a: i64, b: i64, c: i64) -> ArrayList<i64> {
    let n: usize = nums.length()
    let mut out: ArrayList<i64> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        out.push(0)
        i = i + 1
    }
    let mut lo: i64 = 0
    let mut hi: i64 = n as i64 - 1
    if a > 0 {
        let mut slot: i64 = n as i64 - 1
        while lo <= hi {
            let left: i64 = f(nums⁅lo as usize⁆, a, b, c)
            let right: i64 = f(nums⁅hi as usize⁆, a, b, c)
            if left >= right {
                out⁅slot as usize⁆ = left
                lo = lo + 1
            } else {
                out⁅slot as usize⁆ = right
                hi = hi - 1
            }
            slot = slot - 1
        }
    } else {
        let mut slot: i64 = 0
        while lo <= hi {
            let left: i64 = f(nums⁅lo as usize⁆, a, b, c)
            let right: i64 = f(nums⁅hi as usize⁆, a, b, c)
            if left <= right {
                out⁅slot as usize⁆ = left
                lo = lo + 1
            } else {
                out⁅slot as usize⁆ = right
                hi = hi - 1
            }
            slot = slot + 1
        }
    }
    return out
}

class Solution {
    micro sortTransformedArray(self, nums: ArrayList<i64>, a: i64, b: i64, c: i64): ArrayList<i64> {
        return sortTransformedArray(nums, a, b, c)
    }
}
