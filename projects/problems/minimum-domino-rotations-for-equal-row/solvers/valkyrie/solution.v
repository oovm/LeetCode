namespace leetcode.minimum_domino_rotations_for_equal_row;

using std.collection;

# 目标值只可能是第一张牌的正反面之一。对每个候选值扫一遍，
# 统计需要翻的牌数，两个候选共 O(n)。
micro rotations(tops: ArrayList<i64>, bottoms: ArrayList<i64>, target: i64) -> i64 {
    let mut up: i64 = 0
    let mut down: i64 = 0
    let mut i: usize = 0
    while i < tops.length() {
        if tops⁅i⁆ != target && bottoms⁅i⁆ != target {
            return 0 - 1
        }
        if tops⁅i⁆ != target {
            up = up + 1
        }
        if bottoms⁅i⁆ != target {
            down = down + 1
        }
        i = i + 1
    }
    if up < down {
        return up
    }
    return down
}

[export(case: "camelCase")]
micro minDominoRotations(tops: ArrayList<i64>, bottoms: ArrayList<i64>) -> i64 {
    let first: i64 = rotations(tops, bottoms, tops⁅0⁆)
    let second: i64 = rotations(tops, bottoms, bottoms⁅0⁆)
    if first < 0 {
        return second
    }
    if second < 0 {
        return first
    }
    if first < second {
        return first
    }
    return second
}

class Solution {
    micro minDominoRotations(self, tops: ArrayList<i64>, bottoms: ArrayList<i64>): i64 {
        return minDominoRotations(tops, bottoms)
    }
}
