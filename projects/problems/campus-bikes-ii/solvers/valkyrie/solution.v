namespace leetcode.campus_bikes_ii;

using std.collection;

micro absolute(value: i64) -> i64 {
    if value < 0 {
        return 0 - value
    }
    return value
}

micro popcount(mask: i64, bits: i64) -> i64 {
    let mut total: i64 = 0
    let mut index: i64 = 0
    while index < bits {
        if (mask & (1 << index)) != 0 {
            total = total + 1
        }
        index = index + 1
    }
    return total
}

# 位掩码 DP：dp[mask] = 前 popcount(mask) 名工人用 mask 中车辆的最小代价。
[export(case: "camelCase")]
micro assign_bikes(workers: [[i64]], bikes: [[i64]]) -> i64 {
    let n: i64 = workers.length() as i64
    let m: i64 = bikes.length() as i64
    let mut states: i64 = 1
    let mut step: i64 = 0
    while step < m {
        states = states * 2
        step = step + 1
    }
    let infinity: i64 = 1000000000

    let mut dp: ArrayList<i64> = ArrayList::new(states as usize)
    let mut fill: i64 = 0
    while fill < states {
        dp.push(infinity)
        fill = fill + 1
    }
    dp⁅0⁆ = 0

    let mut mask: i64 = 0
    while mask < states {
        let current: i64 = dp⁅mask as usize⁆
        if current < infinity {
            let assigned: i64 = popcount(mask, m)
            if assigned < n {
                let worker_x: i64 = workers⁅assigned as usize⁆⁅0⁆
                let worker_y: i64 = workers⁅assigned as usize⁆⁅1⁆
                let mut bike: i64 = 0
                while bike < m {
                    let bit: i64 = 1 << bike
                    if (mask & bit) == 0 {
                        let distance: i64 = absolute(worker_x - bikes⁅bike as usize⁆⁅0⁆)
                            + absolute(worker_y - bikes⁅bike as usize⁆⁅1⁆)
                        let next_mask: i64 = mask | bit
                        let candidate: i64 = current + distance
                        if candidate < dp⁅next_mask as usize⁆ {
                            dp⁅next_mask as usize⁆ = candidate
                        }
                    }
                    bike = bike + 1
                }
            }
        }
        mask = mask + 1
    }

    let mut best: i64 = infinity
    mask = 0
    while mask < states {
        if popcount(mask, m) == n && dp⁅mask as usize⁆ < best {
            best = dp⁅mask as usize⁆
        }
        mask = mask + 1
    }
    return best
}

class Solution {
    micro assignBikes(self, workers: [[i64]], bikes: [[i64]]): i64 {
        return assign_bikes(workers, bikes)
    }
}
