namespace leetcode.maximum_number_of_balls_in_a_box;

[export(case: "camelCase")]
micro countBalls(lowLimit: i64, highLimit: i64) -> i64 {
    let mut count: ArrayList<i64> = ArrayList::new(46)
    let mut slot: usize = 0
    while slot < 46 {
        count.push(0)
        slot = slot + 1
    }

    let mut x: i64 = lowLimit
    while x <= highLimit {
        let mut sum: usize = 0
        let mut rest: i64 = x
        while rest > 0 {
            sum = sum + (rest % 10) as usize
            rest = rest / 10
        }
        count⁅sum⁆ = count⁅sum⁆ + 1
        x = x + 1
    }

    let mut best: i64 = 0
    let mut i: usize = 0
    while i < 46 {
        if count⁅i⁆ > best {
            best = count⁅i⁆
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro countBalls(self, lowLimit: i64, highLimit: i64): i64 {
        return countBalls(lowLimit, highLimit)
    }
}
