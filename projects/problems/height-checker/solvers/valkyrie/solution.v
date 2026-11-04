namespace leetcode.height_checker;

using std.collection;

# G11：`Array<T>` 没有任何排序入口，`sort.v` 的 `quick_sort` / `merge_sort` 只收
# `ArrayList<T>` 且都是就地改容器。理想写法是一次 `sorted_by` 拿到新序列，
# 不为「排一份副本」手写第二套排序。
[export(case: "camelCase")]
micro height_checker(heights: [i64]) -> i64 {
    let sorted: ArrayList<i64> = sorted_by(heights, micro(a: i64, b: i64) -> i32 {
        if a < b {
            return -1
        }
        if a > b {
            return 1
        }
        return 0
    })

    let count: usize = heights.length()
    let mut mismatched: i64 = 0
    let mut i: usize = 0
    while i < count {
        if heights⁅i⁆ != sorted⁅i⁆ {
            mismatched = mismatched + 1
        }
        i = i + 1
    }
    return mismatched
}

class Solution {
    micro heightChecker(self, heights: [i64]): i64 {
        return height_checker(heights)
    }
}
