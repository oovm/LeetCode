namespace leetcode.sort_array_by_parity_ii;

using std.collection;

# 偶值、奇值各收一列，再按「偶、奇」交错回填；两次线性扫描，无原地交换。
# 题内触发点: G3 —— 返回 `ArrayList<i64>` 依赖聚合返回值 bridge。
[export(case: "camelCase")]
micro sort_array_by_parity_ii(nums: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut evens: ArrayList<i64> = ArrayList::new(count)
    let mut odds: ArrayList<i64> = ArrayList::new(count)
    loop value in nums {
        if value % 2 == 0 {
            evens.push(value)
        } else {
            odds.push(value)
        }
    }

    let mut result: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < evens.length() {
        result.push(evens⁅index⁆)
        result.push(odds⁅index⁆)
        index = index + 1
    }
    return result
}

class Solution {
    micro sortArrayByParityII(self, nums: ArrayList<i64>): ArrayList<i64> {
        return sort_array_by_parity_ii(nums)
    }
}
