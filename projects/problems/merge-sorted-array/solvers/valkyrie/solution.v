namespace leetcode.merge_sorted_array;

micro write_at(mut nums1: ArrayList<i64>, k: i64, value: i64): unit {
    if k < 0 {
        panic("list assignment index out of range")
    }
    let idx: usize = k as usize
    if idx >= nums1.length() {
        panic("list assignment index out of range")
    }
    nums1⁅idx⁆ = value
}

[export(case: "camelCase")]
micro merge(mut nums1: ArrayList<i64>, m: i64, nums2: ArrayList<i64>, n: i64) -> unit {
    let mut k: i64 = m + n - 1
    let mut i: i64 = m - 1
    let mut j: i64 = n - 1
    while j >= 0 {
        if i >= 0 && nums1⁅i as usize⁆.unwrap() > nums2⁅j as usize⁆.unwrap() {
            write_at(nums1, k, nums1⁅i as usize⁆.unwrap())
            i = i - 1
        } else {
            write_at(nums1, k, nums2⁅j as usize⁆.unwrap())
            j = j - 1
        }
        k = k - 1
    }
}

class Solution {
    micro merge(mut self, nums1: ArrayList<i64>, m: i64, nums2: ArrayList<i64>, n: i64): unit {
        merge(nums1, m, nums2, n)
    }
}
