namespace leetcode.house_robber;

# 临时绕过：`loop <var> in <ArrayList>` 在 OVM 后端因 `Cast` lowering 缺失而编译期失败（fail-closed 前表现为运行期零迭代），这里改用显式索引循环；OVM 后端 `Cast` lowering 落地后还原为 `loop ... in`。
# 打家劫舍：滚动保存「抢上一间」与「不抢上一间」两种最优值。
[export(case: "camelCase")]
micro rob(nums: ArrayList<i64>) -> i64 {
    let mut take: i64 = 0
    let mut skip: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        let x: i64 = nums⁅index⁆
        let next_take: i64 = skip + x
        let mut next_skip: i64 = skip
        if take > skip {
            next_skip = take
        }
        take = next_take
        skip = next_skip
        index = index + 1
    }
    if take > skip {
        return take
    }
    return skip
}

class Solution {
    micro rob(self, nums: ArrayList<i64>): i64 {
        return rob(nums)
    }
}
