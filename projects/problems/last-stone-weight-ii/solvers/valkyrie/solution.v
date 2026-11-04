namespace leetcode.last_stone_weight_ii;

# 临时绕过：`loop <var> in <ArrayList>` 在 OVM 后端因 `Cast` lowering 缺失而编译期失败（fail-closed 前表现为运行期零迭代），这里改用显式索引循环；OVM 后端 `Cast` lowering 落地后还原为 `loop ... in`。
# 0/1 背包：尽量把石头分成和最接近的两堆，答案即总和的差值。
[export(name: "lastStoneWeightII")]
micro last_stone_weight_i_i(stones: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    let mut loop_index_7: usize = 0
    while loop_index_7 < stones.length() {
        let stone: i64 = stones⁅loop_index_7⁆
            total = total + stone
        loop_index_7 = loop_index_7 + 1
    }
    let target: i64 = total / 2
    let mut reachable: ArrayList<bool> = ArrayList::new((target + 1) as usize)
    let mut t: i64 = 0
    while t <= target {
        reachable.push(false)
        t = t + 1
    }
    reachable⁅0⁆ = true
    let mut loop_index_18: usize = 0
    while loop_index_18 < stones.length() {
        let stone: i64 = stones⁅loop_index_18⁆
            let mut w: i64 = target
            while w >= stone {
                if reachable⁅(w - stone) as usize⁆ {
                    reachable⁅w as usize⁆ = true
                }
                w = w - 1
            }
        loop_index_18 = loop_index_18 + 1
    }
    let mut best: i64 = target
    while best > 0 {
        if reachable⁅best as usize⁆ {
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
