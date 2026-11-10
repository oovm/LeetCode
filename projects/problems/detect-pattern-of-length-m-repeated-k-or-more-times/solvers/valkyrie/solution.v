namespace leetcode.detect_pattern_of_length_m_repeated_k_or_more_times;

using std.collection;

# 平移 m 自比：`arr[i] == arr[i+m]` 的连续段长达到 `m * (k - 1)` 即存在目标模式。
[export(case: "camelCase")]
micro containsPattern(arr: ArrayList<i64>, m: i64, k: i64) -> bool {
    let length: usize = arr.length()
    let width: usize = m as usize
    if width * (k as usize) > length {
        return false
    }
    let mut run: usize = 0
    let mut index: usize = 0
    while index + width < length {
        if arr⁅index⁆ == arr⁅index + width⁆ {
            run = run + 1
        } else {
            run = 0
        }
        if run >= width * (k as usize - 1) {
            return true
        }
        index = index + 1
    }
    return false
}

class Solution {
    micro containsPattern(self, arr: ArrayList<i64>, m: i64, k: i64): bool {
        return containsPattern(arr, m, k)
    }
}
