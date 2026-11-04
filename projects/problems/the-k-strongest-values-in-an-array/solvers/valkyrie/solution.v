namespace leetcode.the_k_strongest_values_in_an_array;

using std.collection;

# 先按值升序求中位数，再按「与中位数距离降序、值降序」排序。
# 距离比较器捕获外层 `median`，依赖提案 API `sorted_by`（见 G11）。
[export(case: "camelCase")]
micro getStrongest(arr: ArrayList<i64>, k: i64) -> ArrayList<i64> {
    let mut values: ArrayList<i64> = ArrayList::new(arr.length())
    loop value in arr {
        values.push(value)
    }
    sort(values)
    let median: i64 = values⁅(values.length() - 1) / 2⁆

    let ordered: ArrayList<i64> = sorted_by(values, micro(a: i64, b: i64) -> i32 {
        let mut distance_a: i64 = a - median
        if distance_a < 0 {
            distance_a = -distance_a
        }
        let mut distance_b: i64 = b - median
        if distance_b < 0 {
            distance_b = -distance_b
        }
        if distance_a > distance_b {
            return -1
        }
        if distance_a < distance_b {
            return 1
        }
        if a > b {
            return -1
        }
        if a < b {
            return 1
        }
        return 0
    })

    let mut result: ArrayList<i64> = ArrayList::new(k as usize)
    let mut index: usize = 0
    while index < k as usize {
        result.push(ordered⁅index⁆)
        index = index + 1
    }
    return result
}

class Solution {
    micro getStrongest(self, arr: ArrayList<i64>, k: i64): ArrayList<i64> {
        return getStrongest(arr, k)
    }
}
