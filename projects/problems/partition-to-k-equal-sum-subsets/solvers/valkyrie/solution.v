namespace leetcode.solution

using std.collection

# 题内触发点: 位掩码控制组 —— 元素个数 <= 16，用 i64 掩码 + 回溯即可，**不需要 `BitSet`**。
# 本解只用现有入口（`ArrayList` 下标 + `BitSet` 的 `get` / `set` / `clear_bit` 判占用），
# 不含 `clone` / `count` / 迭代 / 互转 / `Equal`，用于核对 G25 的「最小必要面」：
# 当全集 <= 64 且只需判占用时，i64 掩码 + 布尔数组已够，BitSet 的缺失项不构成阻断。
micro fill(nums: ArrayList<i64>, target: i64, start: usize, current: i64, groups_left: i64, used: BitSet) -> bool {
    if current == target {
        if groups_left == 1 {
            return true
        }
        return fill(nums, target, 0, 0, groups_left - 1, used)
    }

    let length: usize = nums.length()
    let mut index: usize = start
    while index < length {
        if !used.get(index) {
            let value: i64 = nums⁅index⁆
            if current + value <= target {
                used.set(index)
                if fill(nums, target, index + 1, current + value, groups_left, used) {
                    return true
                }
                used.clear_bit(index)
            }
        }
        index = index + 1
    }
    return false
}

class Solution {
    [export(case: "canPartitionKSubsets")]
    micro canPartitionKSubsets(nums: ArrayList<i64>, k: i64) -> bool {
        let length: usize = nums.length()
        let mut total: i64 = 0
        loop value in nums {
            total = total + value
        }
        if k <= 0 || total % k != 0 {
            return false
        }

        let target: i64 = total / k
        let mut used: BitSet = BitSet::with_capacity(length)
        return fill(nums, target, 0, 0, k, used)
    }
}
