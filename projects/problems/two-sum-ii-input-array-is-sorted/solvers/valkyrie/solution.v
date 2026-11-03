namespace leetcode.two_sum_ii_input_array_is_sorted;

[export(case: "camelCase")]
micro two_sum(numbers: ArrayList<i64>, target: i64) -> ArrayList<i64> {
    let n: usize = numbers.length()
    let mut i: usize = 0
    while i + 1 < n {
        let x: i64 = target - numbers⁅i⁆
        let mut lo: usize = i + 1
        let mut hi: usize = n
        while lo < hi {
            let mid: usize = (lo + hi) / 2
            if numbers⁅mid⁆ < x {
                lo = mid + 1
            } else {
                hi = mid
            }
        }
        if lo < n && numbers⁅lo⁆ == x {
            let mut result: ArrayList<i64> = ArrayList::new(2)
            result.push(i as i64 + 1)
            result.push(lo as i64 + 1)
            return result
        }
        i = i + 1
    }
    let mut empty: ArrayList<i64> = ArrayList::new(0)
    return empty
}

class Solution {
    micro twoSum(self, numbers: ArrayList<i64>, target: i64): ArrayList<i64> {
        return two_sum(numbers, target)
    }
}
