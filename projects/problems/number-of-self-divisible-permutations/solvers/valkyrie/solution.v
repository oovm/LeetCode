namespace leetcode.number_of_self_divisible_permutations;

micro gcd(a: i64, b: i64) -> i64 {
    let mut left: i64 = a
    let mut right: i64 = b
    while right != 0 {
        let remainder: i64 = left % right
        left = right
        right = remainder
    }
    return left
}

[export(case: "camelCase")]
micro selfDivisiblePermutationCount(n: i64) -> i64 {
    let states: i64 = 1 << n
    let mut dp: ArrayList<i64> = ArrayList::new(states as usize)
    let mut slot: i64 = 0
    while slot < states {
        dp.push(0)
        slot = slot + 1
    }
    dp⁅0 as usize⁆ = 1

    let mut mask: i64 = 0
    while mask < states {
        let current: i64 = dp⁅mask as usize⁆
        let mut bits: i64 = mask
        let mut position: i64 = 1
        while bits > 0 {
            position = position + (bits & 1)
            bits = bits >> 1
        }
        if current > 0 && position <= n {
            let mut value: i64 = 1
            while value <= n {
                let bit: i64 = 1 << (value - 1)
                if (mask & bit) == 0 && gcd(position, value) == 1 {
                    let next: usize = (mask | bit) as usize
                    dp⁅next⁆ = dp⁅next⁆ + current
                }
                value = value + 1
            }
        }
        mask = mask + 1
    }

    let full: usize = (states - 1) as usize
    return dp⁅full⁆
}

class Solution {
    micro selfDivisiblePermutationCount(self, n: i64): i64 {
        return selfDivisiblePermutationCount(n)
    }
}
