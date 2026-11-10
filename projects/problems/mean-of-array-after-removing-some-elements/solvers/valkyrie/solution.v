namespace leetcode.mean_of_array_after_removing_some_elements;

using std.collection;

# 排序后去掉两端各 5% 再求均值；均值可能非整，按 f64 返回（G2 / G3 面）。
# 题内触发点: trimMean 返回 `f64`（去尾均值含非整商），归 G2 / G3 面。
[export(case: "camelCase")]
micro trimMean(arr: ArrayList<i64>) -> f64 {
    let mut sorted: ArrayList<i64> = ArrayList::new(arr.length())
    loop value in arr {
        sorted.push(value)
    }
    sort(sorted)
    let length: usize = sorted.length()
    let cut: usize = length / 20
    let mut sum: i64 = 0
    let mut index: usize = cut
    while index < length - cut {
        sum = sum + sorted⁅index⁆
        index = index + 1
    }
    return (sum as f64) / ((length - 2 * cut) as f64)
}

class Solution {
    micro trimMean(self, arr: ArrayList<i64>): f64 {
        return trimMean(arr)
    }
}
