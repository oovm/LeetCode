namespace leetcode.the_number_of_ways_to_make_the_sum;

[export(case: "camelCase")]
micro numberOfWays(n: i64) -> i64 {
    let mod: i64 = 1000000007
    let mut dp: ArrayList<i64> = ArrayList::new((n + 1) as usize)
    let mut slot: i64 = 0
    while slot <= n {
        dp.push(0)
        slot = slot + 1
    }
    dp⁅0 as usize⁆ = 1

    let mut coins: ArrayList<i64> = ArrayList::new(3)
    coins.push(1)
    coins.push(2)
    coins.push(6)

    let mut c: usize = 0
    while c < 3 {
        let coin: i64 = coins⁅c⁆
        let mut sum: i64 = coin
        while sum <= n {
            let index: usize = sum as usize
            let rest: usize = (sum - coin) as usize
            dp⁅index⁆ = (dp⁅index⁆ + dp⁅rest⁆) % mod
            sum = sum + 1
        }
        c = c + 1
    }

    let mut answer: i64 = dp⁅n as usize⁆
    if n >= 4 {
        let afterOne: usize = (n - 4) as usize
        answer = (answer + dp⁅afterOne⁆) % mod
    }
    if n >= 8 {
        let afterTwo: usize = (n - 8) as usize
        answer = (answer + dp⁅afterTwo⁆) % mod
    }
    return answer
}

class Solution {
    micro numberOfWays(self, n: i64): i64 {
        return numberOfWays(n)
    }
}
