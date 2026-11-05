namespace leetcode.number_of_sub_arrays_of_size_k_and_average_greater_than_or_equal_to_threshold;

using std.collection;

# 定长滑动窗口，和达到 `k * threshold` 就计数，一趟 O(n)。
[export(case: "camelCase")]
micro numOfSubarrays(arr: ArrayList<i64>, k: i64, threshold: i64) -> i64 {
    let count: i64 = arr.length() as i64
    let needed: i64 = k * threshold
    let mut window: i64 = 0
    let mut i: i64 = 0
    while i < k && i < count {
        window = window + arr⁅i as usize⁆
        i = i + 1
    }
    let mut total: i64 = 0
    if window >= needed {
        total = 1
    }
    while i < count {
        window = window + arr⁅i as usize⁆ - arr⁅(i - k) as usize⁆
        if window >= needed {
            total = total + 1
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro numOfSubarrays(self, arr: ArrayList<i64>, k: i64, threshold: i64): i64 {
        return numOfSubarrays(arr, k, threshold)
    }
}
