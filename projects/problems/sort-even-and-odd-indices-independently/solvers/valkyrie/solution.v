namespace leetcode.sort_even_and_odd_indices_independently;

using std.collection;

micro compare_asc(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

micro compare_desc(a: i64, b: i64) -> i32 {
    if a > b {
        return -1
    }
    if a < b {
        return 1
    }
    return 0
}

# 偶下标列升序、奇下标列降序，再按原位置交替回填。
# 题内触发点: G11 —— 两列都要先物化成 `ArrayList` 才能 `merge_sort`（就地），
# 没有「排一份副本并返回新序列」的入口。
[export(case: "camelCase")]
micro sort_even_odd(nums: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut evens: ArrayList<i64> = ArrayList::new(count)
    let mut odds: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        if index % 2 == 0 {
            evens.push(nums⁅index⁆)
        } else {
            odds.push(nums⁅index⁆)
        }
        index = index + 1
    }

    merge_sort(evens, compare_asc)
    merge_sort(odds, compare_desc)

    let mut result: ArrayList<i64> = ArrayList::new(count)
    index = 0
    while index < count {
        let slot: usize = index / 2
        if index % 2 == 0 {
            result.push(evens⁅slot⁆)
        } else {
            result.push(odds⁅slot⁆)
        }
        index = index + 1
    }
    return result
}

class Solution {
    micro sortEvenOdd(self, nums: ArrayList<i64>): ArrayList<i64> {
        return sort_even_odd(nums)
    }
}
