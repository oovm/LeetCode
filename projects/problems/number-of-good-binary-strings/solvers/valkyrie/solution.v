namespace leetcode.number_of_good_binary_strings;

[export(case: "camelCase")]
micro goodBinaryStrings(minLength: i64, maxLength: i64, oneGroup: i64, zeroGroup: i64) -> i64 {
    let mod: i64 = 1000000007
    let mut dp: ArrayList<i64> = ArrayList::new((maxLength + 1) as usize)
    let mut slot: i64 = 0
    while slot <= maxLength {
        dp.push(0)
        slot = slot + 1
    }
    let zero: usize = 0
    dp⁅zero⁆ = 1

    let mut length: i64 = 1
    while length <= maxLength {
        let index: usize = length as usize
        let mut ways: i64 = 0
        if length >= zeroGroup {
            let afterZero: usize = (length - zeroGroup) as usize
            ways = ways + dp⁅afterZero⁆
        }
        if length >= oneGroup {
            let afterOne: usize = (length - oneGroup) as usize
            ways = ways + dp⁅afterOne⁆
        }
        dp⁅index⁆ = ways % mod
        length = length + 1
    }

    let mut answer: i64 = 0
    let mut length: i64 = minLength
    while length <= maxLength {
        answer = (answer + dp⁅length as usize⁆) % mod
        length = length + 1
    }
    return answer
}

class Solution {
    micro goodBinaryStrings(self, minLength: i64, maxLength: i64, oneGroup: i64, zeroGroup: i64): i64 {
        return goodBinaryStrings(minLength, maxLength, oneGroup, zeroGroup)
    }
}
