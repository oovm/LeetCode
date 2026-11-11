namespace leetcode.delete_and_earn;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 按数值聚合成 points，再做打家劫舍式递推。
[export(case: "camelCase")]
micro delete_and_earn(nums: [i64]) -> i64 {
    let mut maximum: i64 = 0
    loop x in nums {
        if x > maximum {
            maximum = x
        }
    }
    let mut counts: ArrayList<i64> = ArrayList::new((maximum + 1) as usize)
    let mut v: i64 = 0
    while v <= maximum {
        counts.push(0)
        v = v + 1
    }
    loop x in nums {
        counts⁅x as usize⁆ = counts⁅x as usize⁆ + 1
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
    micro deleteAndEarn(self, nums: [i64]): i64 {
        return delete_and_earn(nums)
    }
}
