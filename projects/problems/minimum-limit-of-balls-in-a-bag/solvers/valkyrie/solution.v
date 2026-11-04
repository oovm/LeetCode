namespace leetcode.minimum_limit_of_balls_in_a_bag;

using std.collection;

# 临时绕过：`loop <var> in <ArrayList>` 在 OVM 后端因 `Cast` lowering 缺失而编译期失败（fail-closed 前表现为运行期零迭代），这里改用显式索引循环；OVM 后端 `Cast` lowering 落地后还原为 `loop ... in`。
# 二分答案：袋子上限越小，操作数越多；操作数关于上限单调递减。
# 一个袋子拆到每袋不超过 `size` 需要 `(count - 1) / size` 次操作。
micro operations(nums: ArrayList<i64>, size: i64) -> i64 {
    let mut total: i64 = 0
    let mut loop_index_9: usize = 0
    while loop_index_9 < nums.length() {
        let count: i64 = nums⁅loop_index_9⁆
            total = total + (count - 1) / size
        loop_index_9 = loop_index_9 + 1
    }
    return total
}

[export(case: "camelCase")]
micro minimumSize(nums: ArrayList<i64>, maxOperations: i64) -> i64 {
    let mut low: i64 = 1
    let mut high: i64 = 0
    let mut loop_index_19: usize = 0
    while loop_index_19 < nums.length() {
        let count: i64 = nums⁅loop_index_19⁆
            if count > high {
                high = count
            }
        loop_index_19 = loop_index_19 + 1
    }
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if operations(nums, mid) <= maxOperations {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return low
}

class Solution {
    micro minimumSize(self, nums: ArrayList<i64>, maxOperations: i64): i64 {
        return minimumSize(nums, maxOperations)
    }
}
