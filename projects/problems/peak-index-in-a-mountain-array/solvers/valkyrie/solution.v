namespace leetcode.peak_index_in_a_mountain_array;

using std.collection;

# 山形数组单调可分，二分找第一个 `arr[mid] > arr[mid + 1]` 的位置，O(log n)。
[export(case: "camelCase")]
micro peak_index_in_mountain_array(arr: ArrayList<i64>) -> i64 {
    let mut left: usize = 1
    let mut right: usize = arr.length() - 2
    while left < right {
        let mid: usize = (left + right) / 2
        if arr⁅mid⁆ > arr⁅mid + 1⁆ {
            right = mid
        } else {
            left = mid + 1
        }
    }
    return left as i64
}

class Solution {
    micro peakIndexInMountainArray(self, arr: ArrayList<i64>): i64 {
        return peak_index_in_mountain_array(arr)
    }
}
