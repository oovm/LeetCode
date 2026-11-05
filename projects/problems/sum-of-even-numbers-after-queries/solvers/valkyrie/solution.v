namespace leetcode.sum_of_even_numbers_after_queries;

using std.collection;

# 维护当前偶数和，每个查询先扣除旧值再补入新值，单次 O(1)。
[export(case: "camelCase")]
micro sum_even_after_queries(nums: ArrayList<i64>, queries: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let mut total: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        if nums⁅index⁆ % 2 == 0 {
            total = total + nums⁅index⁆
        }
        index = index + 1
    }
    let mut result: ArrayList<i64> = ArrayList::new(queries.length())
    let mut step: usize = 0
    while step < queries.length() {
        let value: i64 = queries⁅step⁆⁅0⁆
        let at: usize = queries⁅step⁆⁅1⁆ as usize
        let old: i64 = nums⁅at⁆
        if old % 2 == 0 {
            total = total - old
        }
        let updated: i64 = old + value
        nums⁅at⁆ = updated
        if updated % 2 == 0 {
            total = total + updated
        }
        result.push(total)
        step = step + 1
    }
    return result
}

class Solution {
    micro sumEvenAfterQueries(self, nums: ArrayList<i64>, queries: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return sum_even_after_queries(nums, queries)
    }
}
