namespace leetcode.maximum_strong_pair_xor_i;

using std.collection;

# 枚举数对，满足 |x-y| <= min(x, y) 时更新异或最大值。
[export(case: "camelCase")]
micro maximumStrongPairXor(nums: ArrayList<i64>) -> i64 {
    let mut best: i64 = 0
    let mut i: usize = 0
    while i < nums.length() {
        let x: i64 = nums⁅i⁆
        let mut j: usize = 0
        while j < nums.length() {
            let y: i64 = nums⁅j⁆
            let mut diff: i64 = x - y
            if diff < 0 {
                diff = -diff
            }
            let mut smaller: i64 = x
            if y < smaller {
                smaller = y
            }
            if diff <= smaller {
                let candidate: i64 = x.bit_xor(y)
                if candidate > best {
                    best = candidate
                }
            }
            j = j + 1
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro maximumStrongPairXor(self, nums: ArrayList<i64>): i64 {
        return maximumStrongPairXor(nums)
    }
}
