namespace leetcode.sort_array_by_parity_ii;

using std.collection;

# 原地双指针：偶位若为奇数，就与下一个奇位上的偶数交换；与 Python 参考同一规范落序。
# 题内触发点: G3 —— 返回 `ArrayList<i64>` 依赖聚合返回值 bridge。
[export(case: "camelCase")]
micro sort_array_by_parity_ii(nums: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut odd: usize = 1
    let mut even: usize = 0
    while even < count {
        if nums⁅even⁆ % 2 != 0 {
            while nums⁅odd⁆ % 2 != 0 {
                odd = odd + 2
            }
            let tmp: i64 = nums⁅even⁆
            nums⁅even⁆ = nums⁅odd⁆
            nums⁅odd⁆ = tmp
        }
        even = even + 2
    }
    return nums
}

class Solution {
    micro sortArrayByParityII(self, nums: ArrayList<i64>): ArrayList<i64> {
        return sort_array_by_parity_ii(nums)
    }
}
