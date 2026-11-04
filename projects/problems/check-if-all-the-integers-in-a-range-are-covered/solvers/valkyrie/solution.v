namespace leetcode.check_if_all_the_integers_in_a_range_are_covered;

using std.collection;

# BitSet 标记覆盖域：逐区间置位（只落 [left, right] 内的值），再线性校验整段。
# 位图承载「是否出现」这一维，额外空间 O(right)。
[export(case: "camelCase")]
micro is_covered(ranges: ArrayList<ArrayList<i64>>, left: i64, right: i64) -> bool {
    let mut covered: BitSet = BitSet::with_capacity((right + 1) as usize)

    let count: usize = ranges.length()
    let mut i: usize = 0
    while i < count {
        let span: ArrayList<i64> = ranges⁅i⁆
        let mut value: i64 = span⁅0⁆
        while value <= span⁅1⁆ {
            if value >= left && value <= right {
                covered.set(value as usize)
            }
            value = value + 1
        }
        i = i + 1
    }

    let mut probe: i64 = left
    while probe <= right {
        if !covered.get(probe as usize) {
            return false
        }
        probe = probe + 1
    }
    return true
}

class Solution {
    micro isCovered(self, ranges: ArrayList<ArrayList<i64>>, left: i64, right: i64): bool {
        return is_covered(ranges, left, right)
    }
}
