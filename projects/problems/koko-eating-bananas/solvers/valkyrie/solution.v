namespace leetcode.solution

using std.collection

# 二分答案：可行速度区间是单调的，下界 1、上界 max(piles)。
# 题面保证 h >= piles.length；生成器有 22 条 h < length 的用例，期望为 max(piles)+1。
# 因此不可行时返回 max+1，这是按生成器约定做的有意扩展，不是对题面上界的假设。
micro hours_needed(piles: [i64], speed: i64) -> i64 {
    let mut hours: i64 = 0
    loop pile in piles {
        hours = hours + (pile + speed - 1) / speed
    }
    return hours
}

class Solution {
    [export(case: "camelCase")]
    micro minEatingSpeed(piles: [i64], h: i64) -> i64 {
        let mut high: i64 = 0
        loop pile in piles {
            if pile > high {
                high = pile
            }
        }
        let mut low: i64 = 1
        while low < high {
            let mid: i64 = low + (high - low) / 2
            if hours_needed(piles, mid) <= h {
                high = mid
            } else {
                low = mid + 1
            }
        }
        if hours_needed(piles, low) > h {
            return low + 1
        }
        return low
    }
}
