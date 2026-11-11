namespace leetcode.find_the_losers_of_the_circular_game;

# 模拟接球，步长为 i * k，标记所有接到球的玩家。
[export(case: "camelCase")]
micro circular_game_losers(n: i64, k: i64) -> [i64] {
    let mut seen: ArrayList<bool> = ArrayList::new(n as usize)
    let mut i: i64 = 0
    while i < n {
        seen.push(false)
        i = i + 1
    }
    let mut position: i64 = 0
    let mut step: i64 = 1
    while seen⁅position as usize⁆ == false {
        seen⁅position as usize⁆ = true
        position = (position + step * k) % n
        step = step + 1
    }
    let mut result: ArrayList<i64> = ArrayList::new(0)
    i = 0
    while i < n {
        if !seen⁅i as usize⁆ {
            result.push(i + 1)
        }
        i = i + 1
    }
    return result.to_array()
}

class Solution {
    micro circularGameLosers(self, n: i64, k: i64): [i64] {
        return circular_game_losers(n, k)
    }
}
