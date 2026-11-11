namespace leetcode.find_k_closest_elements;

using std.collection;

# 最优窗口起点 l 满足：若 x - arr[l] > arr[l+k] - x 则右移。
# 二分 l 的取值区间 [0, n-k]，再切出长度 k 的窗口，O(log n + k)。
[export(case: "camelCase")]
micro find_closest_elements(arr: [i64], k: i64, x: i64) -> [i64] {
    let total: i64 = arr.length() as i64
    if k >= total {
        return arr
    }
    let mut low: i64 = 0
    let mut high: i64 = total - k
    while low < high {
        let middle: i64 = (low + high) / 2
        let left_gap: i64 = x - arr⁅middle as usize⁆
        let right_gap: i64 = arr⁅(middle + k) as usize⁆ - x
        if left_gap > right_gap {
            low = middle + 1
        } else {
            high = middle
        }
    }
    let mut window: ArrayList<i64> = ArrayList::new(k as usize)
    let mut offset: i64 = 0
    while offset < k {
        window.push(arr⁅(low + offset) as usize⁆)
        offset = offset + 1
    }
    return window.to_array()
}

class Solution {
    micro findClosestElements(self, arr: [i64], k: i64, x: i64): [i64] {
        return find_closest_elements(arr, k, x)
    }
}
