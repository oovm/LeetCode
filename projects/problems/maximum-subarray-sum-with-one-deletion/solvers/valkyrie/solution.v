namespace leetcode.maximum_subarray_sum_with_one_deletion;

using std.collection;

# 两个滚动状态：未删除过的最大子数组、已删除过一次的最大子数组，
# 每步只在「删当前」与「延续」之间转移，一趟 O(n)。
[export(case: "camelCase")]
micro maximumSum(arr: ArrayList<i64>) -> i64 {
    let mut no_delete: i64 = arr⁅0⁆
    let mut one_delete: i64 = 0 - 1000000000000000000
    let mut best: i64 = arr⁅0⁆
    let mut i: usize = 1
    while i < arr.length() {
        let value: i64 = arr⁅i⁆
        let continued: i64 = one_delete + value
        let mut next_one: i64 = no_delete
        if continued > next_one {
            next_one = continued
        }
        let kept: i64 = no_delete + value
        let mut next_no: i64 = value
        if kept > next_no {
            next_no = kept
        }
        no_delete = next_no
        one_delete = next_one
        if no_delete > best {
            best = no_delete
        }
        if one_delete > best {
            best = one_delete
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro maximumSum(self, arr: ArrayList<i64>): i64 {
        return maximumSum(arr)
    }
}
