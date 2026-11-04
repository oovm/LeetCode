namespace leetcode.ways_to_make_a_fair_array;

using std.collection;

# 前缀和按奇偶下标分开累计。
# 删除第 `i` 项后，右侧元素整体左移一格，奇偶性互换。
[export(case: "camelCase")]
micro waysToMakeFair(nums: ArrayList<i64>) -> i64 {
    let mut even_total: i64 = 0
    let mut odd_total: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        if index % 2 == 0 {
            even_total = even_total + nums⁅index⁆
        } else {
            odd_total = odd_total + nums⁅index⁆
        }
        index = index + 1
    }

    let mut even_before: i64 = 0
    let mut odd_before: i64 = 0
    let mut ways: i64 = 0
    index = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        let removed_even: i64 = even_total - even_before
        let removed_odd: i64 = odd_total - odd_before
        let mut next_even: i64 = even_before + removed_odd
        if index % 2 == 1 {
            next_even = next_even - value
        }
        let mut next_odd: i64 = odd_before + removed_even
        if index % 2 == 0 {
            next_odd = next_odd - value
        }
        if next_even == next_odd {
            ways = ways + 1
        }

        if index % 2 == 0 {
            even_before = even_before + value
        } else {
            odd_before = odd_before + value
        }
        index = index + 1
    }
    return ways
}

class Solution {
    micro waysToMakeFair(self, nums: ArrayList<i64>): i64 {
        return waysToMakeFair(nums)
    }
}
