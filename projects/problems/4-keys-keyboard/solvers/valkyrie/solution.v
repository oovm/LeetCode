namespace leetcode.four_keys_keyboard;

[export(case: "camelCase")]
micro maxA(n: i64) -> i64 {
    let mut dp: ArrayList<i64> = ArrayList::new((n + 1) as usize)
    let mut slot: i64 = 0
    while slot <= n {
        dp.push(0)
        slot = slot + 1
    }

    let mut i: i64 = 1
    while i <= n {
        let index: usize = i as usize
        let previous: usize = (i - 1) as usize
        let mut best: i64 = dp⁅previous⁆ + 1
        let mut j: i64 = 1
        while j <= i - 3 {
            let base: usize = j as usize
            let candidate: i64 = dp⁅base⁆ * (i - j - 1)
            if candidate > best {
                best = candidate
            }
            j = j + 1
        }
        dp⁅index⁆ = best
        i = i + 1
    }
    return dp⁅n as usize⁆
}

class Solution {
    micro maxA(self, n: i64): i64 {
        return maxA(n)
    }
}
