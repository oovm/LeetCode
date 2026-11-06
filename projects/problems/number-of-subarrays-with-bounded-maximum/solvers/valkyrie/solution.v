namespace leetcode.solution

using std.collection

# 计数差：max <= bound 的子数组数减去 max <= left-1 的子数组数，正好是 max 落在 [left, right] 的数目。
# 单次计数是「连续不超过 bound 的段长」求和，不需要单调栈或排序。
micro count_at_most(nums: ArrayList<i64>, bound: i64) -> i64 {
    let mut result: i64 = 0
    let mut run: i64 = 0
    loop value in nums {
        if value <= bound {
            run = run + 1
        } else {
            run = 0
        }
        result = result + run
    }
    return result
}

class Solution {
    [export(case: "camelCase")]
    micro numSubarrayBoundedMax(nums: ArrayList<i64>, left: i64, right: i64) -> i64 {
        return count_at_most(nums, right) - count_at_most(nums, left - 1)
    }
}
