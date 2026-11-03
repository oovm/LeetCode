namespace leetcode.last_stone_weight_ii;

# 0/1 背包：尽量把石头分成和最接近的两堆，答案即总和的差值。
[export(case: "camelCase")]
micro last_stone_weight_i_i(stones: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    loop stone in stones {
        total = total + stone
    }
    let target: i64 = total / 2
    let mut reachable: ArrayList<bool> = ArrayList::new((target + 1) as usize)
    let mut t: i64 = 0
    while t <= target {
        reachable.push(false)
        t = t + 1
    }
    reachable⁅0⁆ = true
    loop stone in stones {
        let mut w: i64 = target
        while w >= stone {
            if reachable⁅(w - stone) as usize⁆.unwrap() {
                reachable⁅w as usize⁆ = true
            }
            w = w - 1
        }
    }
    let mut best: i64 = target
    while best > 0 {
        if reachable⁅best as usize⁆.unwrap() {
            return total - 2 * best
        }
        best = best - 1
    }
    return total
}

class Solution {
    micro lastStoneWeightII(self, stones: ArrayList<i64>): i64 {
        return last_stone_weight_i_i(stones)
    }
}
