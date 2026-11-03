namespace leetcode.ugly_number_ii;

[export(case: "camelCase")]
micro nthUglyNumber(n: i64) -> i64 {
    let mut dp: ArrayList<i64> = ArrayList::new(n as usize)
    dp.push(1)
    let mut p2: usize = 0
    let mut p3: usize = 0
    let mut p5: usize = 0
    let mut i: usize = 1
    while i < n as usize {
        let v2: i64 = dp⁅p2⁆ * 2
        let v3: i64 = dp⁅p3⁆ * 3
        let v5: i64 = dp⁅p5⁆ * 5
        let mut value: i64 = v2
        if v3 < value {
            value = v3
        }
        if v5 < value {
            value = v5
        }
        dp.push(value)
        if value == v2 {
            p2 = p2 + 1
        }
        if value == v3 {
            p3 = p3 + 1
        }
        if value == v5 {
            p5 = p5 + 1
        }
        i = i + 1
    }
    let last: usize = (n - 1) as usize
    return dp⁅last⁆
}

class Solution {
    micro nthUglyNumber(self, n: i64): i64 {
        return nthUglyNumber(n)
    }
}
