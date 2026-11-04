namespace leetcode.minimum_cost_to_move_chips_to_the_same_position

# 同奇偶之间移动代价为 0，跨奇偶每步代价 1，因此把全部筹码移到奇位或偶位的代价是较小那一类计数。
[export(case: "camelCase")]
micro minCostToMoveChips(position: ArrayList<i64>) -> i64 {
    let count: usize = position.length()
    let mut even: i64 = 0
    let mut odd: i64 = 0
    let mut i: usize = 0
    while i < count {
        if position⁅i⁆ % 2 == 0 {
            even = even + 1
        }
        if position⁅i⁆ % 2 != 0 {
            odd = odd + 1
        }
        i = i + 1
    }
    if even < odd {
        return even
    }
    return odd
}

class Solution {
    micro minCostToMoveChips(self, position: ArrayList<i64>): i64 {
        return minCostToMoveChips(position)
    }
}
