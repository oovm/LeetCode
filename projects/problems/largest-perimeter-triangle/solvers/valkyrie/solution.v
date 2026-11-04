namespace leetcode.largest_perimeter_triangle;

using std.collection;

# 降序后首个满足 a < b + c 的三元组即最大周长（降序保证首个命中的和最大）。
# 题内触发点: G11 —— `Array<T>` 没有任何排序入口，`sorted_by` 只收 `ArrayList<T>`；
# 理想写法是直接 `sorted_by(nums, cmp)` 拿一份新序列。本题是 G11 的第二实例
# （第一实例为 `height-checker`，见批次 R4）。
[export(case: "camelCase")]
micro largest_perimeter(nums: [i64]) -> i64 {
    let ordered: ArrayList<i64> = sorted_by(nums, micro(a: i64, b: i64) -> i32 {
        if a > b {
            return -1
        }
        if a < b {
            return 1
        }
        return 0
    })

    let count: usize = ordered.length()
    let mut i: usize = 0
    while i + 2 < count {
        let longest: i64 = ordered⁅i⁆
        let middle: i64 = ordered⁅i + 1⁆
        let shortest: i64 = ordered⁅i + 2⁆
        if longest < middle + shortest {
            return longest + middle + shortest
        }
        i = i + 1
    }
    return 0
}

class Solution {
    micro largestPerimeter(self, nums: [i64]): i64 {
        return largest_perimeter(nums)
    }
}
