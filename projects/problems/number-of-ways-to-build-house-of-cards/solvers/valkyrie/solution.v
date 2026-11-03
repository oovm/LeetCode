namespace leetcode.number_of_ways_to_build_house_of_cards;

[export(case: "camelCase")]
micro houseOfCards(n: i64) -> i64 {
    let mut dp: ArrayList<i64> = ArrayList::new((n + 1) as usize)
    let mut slot: i64 = 0
    while slot <= n {
        dp.push(0)
        slot = slot + 1
    }
    dp⁅0 as usize⁆ = 1

    let mut t: i64 = 1
    while 3 * t - 1 <= n {
        let cost: i64 = 3 * t - 1
        let mut sum: i64 = n
        while sum >= cost {
            let index: usize = sum as usize
            let rest: usize = (sum - cost) as usize
            dp⁅index⁆ = dp⁅index⁆ + dp⁅rest⁆
            sum = sum - 1
        }
        t = t + 1
    }
    return dp⁅n as usize⁆
}

class Solution {
    micro houseOfCards(self, n: i64): i64 {
        return houseOfCards(n)
    }
}
