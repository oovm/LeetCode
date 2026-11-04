namespace leetcode.delete_and_earn;

# 临时绕过：`loop <var> in <ArrayList>` 当前编译不报错但运行期零迭代，这里改用显式索引循环；`IntoIterator` 合同恢复后还原为 `loop ... in`。
# 按数值聚合成 points，再做打家劫舍式递推。
[export(case: "camelCase")]
micro delete_and_earn(nums: ArrayList<i64>) -> i64 {
    let mut maximum: i64 = 0
    let mut loop_index_7: usize = 0
    while loop_index_7 < nums.length() {
        let x: i64 = nums⁅loop_index_7⁆
            if x > maximum {
                maximum = x
            }
        loop_index_7 = loop_index_7 + 1
    }
    let mut counts: ArrayList<i64> = ArrayList::new((maximum + 1) as usize)
    let mut v: i64 = 0
    while v <= maximum {
        counts.push(0)
        v = v + 1
    }
    let mut loop_index_18: usize = 0
    while loop_index_18 < nums.length() {
        let x: i64 = nums⁅loop_index_18⁆
            counts⁅x as usize⁆ = counts⁅x as usize⁆ + 1
        loop_index_18 = loop_index_18 + 1
    }
    let mut take: i64 = 0
    let mut skip: i64 = 0
    v = 0
    while v <= maximum {
        let gain: i64 = v * counts⁅v as usize⁆
        let next_take: i64 = skip + gain
        let mut next_skip: i64 = skip
        if take > skip {
            next_skip = take
        }
        take = next_take
        skip = next_skip
        v = v + 1
    }
    if take > skip {
        return take
    }
    return skip
}

class Solution {
    micro deleteAndEarn(self, nums: ArrayList<i64>): i64 {
        return delete_and_earn(nums)
    }
}
