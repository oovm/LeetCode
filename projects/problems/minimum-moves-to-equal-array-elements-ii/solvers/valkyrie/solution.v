namespace leetcode.minimum_moves_to_equal_array_elements_ii;

using std.collection;

micro compare_asc(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

micro abs_i64(x: i64) -> i64 {
    if x < 0 {
        return -x
    }
    return x
}

# 排序后取中位数，各元素到中位数的绝对差之和即最少操作数。
# 排序走 `sorted_by`：返回新序列，不改动入参。
# 题内触发点: G16 —— `BTreeSet.nth` 未提供，且集合会去重破坏中位数语义，本题须保留重复值。
[export(case: "camelCase")]
micro min_moves2(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    if count == 0 {
        return 0
    }

    let ordered: ArrayList<i64> = sorted_by(nums, compare_asc)

    let median: i64 = ordered⁅count / 2⁆
    let mut moves: i64 = 0
    let mut index: usize = 0
    while index < count {
        moves = moves + abs_i64(ordered⁅index⁆ - median)
        index = index + 1
    }
    return moves
}

class Solution {
    micro minMoves2(self, nums: ArrayList<i64>): i64 {
        return min_moves2(nums)
    }
}
