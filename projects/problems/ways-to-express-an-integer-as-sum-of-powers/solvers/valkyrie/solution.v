namespace leetcode.ways_to_express_an_integer_as_sum_of_powers;

[export(case: "camelCase")]
micro numberOfWays(n: i64, x: i64) -> i64 {
    let mod: i64 = 1000000007
    let mut dp: ArrayList<i64> = ArrayList::new((n + 1) as usize)
    let mut slot: i64 = 0
    while slot <= n {
        dp.push(0)
        slot = slot + 1
    }
    dp⁅0 as usize⁆ = 1

    let mut base: i64 = 1
    let mut running: bool = true
    while running {
        let mut power: i64 = 1
        let mut k: i64 = 0
        while k < x && power <= n {
            power = power * base
            k = k + 1
        }
        if power > n {
            running = false
        } else {
            let mut sum: i64 = n
            while sum >= power {
                let index: usize = sum as usize
                let rest: usize = (sum - power) as usize
                dp⁅index⁆ = (dp⁅index⁆ + dp⁅rest⁆) % mod
                sum = sum - 1
            }
            base = base + 1
        }
    }
    return dp⁅n as usize⁆
}

class Solution {
    micro numberOfWays(self, n: i64, x: i64): i64 {
        return numberOfWays(n, x)
    }
}
