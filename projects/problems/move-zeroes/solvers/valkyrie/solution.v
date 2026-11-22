namespace leetcode.move_zeroes;

using std.collection

# 题目要求原地移动零：`[i64]` 直接表达宿主数组，错位交换只经 `Array.length`
# 与 `Cardinal` 读写合同，不依赖聚合/容器布局。
[export(case: "camelCase")]
micro move_zeroes(mut nums: [i64]) -> unit {
    let mut k: usize = 0
    let mut i: usize = 0
    while i < nums.length() {
        let x: i64 = nums⁅i⁆
        if x != 0 {
            let tmp: i64 = nums⁅k⁆
            nums⁅k⁆ = x
            nums⁅i⁆ = tmp
            k = k + 1
        }
        i = i + 1
    }
}

class Solution {
    micro moveZeroes(mut self, nums: [i64]): unit {
        move_zeroes(nums)
    }
}
