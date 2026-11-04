namespace leetcode.height_checker;

using std.collection;

# G11：`Array<T>` 没有任何排序入口，`sort.v` 的 `quick_sort` / `merge_sort` 只收
# `ArrayList<T>` 且都是就地改容器。这里先把 `[i64]` 拷进副本，再就地 `merge_sort`；
# 不为「排一份副本」手写第二套排序。
micro compare_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro height_checker(heights: [i64]) -> i64 {
    let count: usize = heights.length()
    let mut ordered: ArrayList<i64> = ArrayList::new(count)
    let mut i: usize = 0
    while i < count {
        ordered.push(heights⁅i⁆)
        i = i + 1
    }
    merge_sort(ordered, compare_i64)

    let mut mismatched: i64 = 0
    i = 0
    while i < count {
        if heights⁅i⁆ != ordered⁅i⁆ {
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
