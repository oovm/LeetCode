namespace leetcode.count_ways_to_build_good_strings;

[export(case: "camelCase")]
micro countGoodStrings(low: i64, high: i64, zero: i64, one: i64) -> i64 {
    let mod: i64 = 1000000007
    let mut dp: ArrayList<i64> = ArrayList::new((high + 1) as usize)
    let mut slot: i64 = 0
    while slot <= high {
        dp.push(0)
        slot = slot + 1
    }
    dp⁅0 as usize⁆ = 1

    let mut length: i64 = 1
    while length <= high {
        let index: usize = length as usize
        let mut ways: i64 = 0
        if length >= zero {
            let rest: usize = (length - zero) as usize
            ways = ways + dp⁅rest⁆
        }
        if length >= one {
            let rest: usize = (length - one) as usize
            ways = ways + dp⁅rest⁆
        }
        dp⁅index⁆ = ways % mod
        length = length + 1
    }

    let mut answer: i64 = 0
    let mut length: i64 = low
    while length <= high {
        answer = (answer + dp⁅length as usize⁆) % mod
        length = length + 1
    }
    return answer
}

class Solution {
    micro countGoodStrings(self, low: i64, high: i64, zero: i64, one: i64): i64 {
        return countGoodStrings(low, high, zero, one)
    }
}
