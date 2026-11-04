namespace leetcode.merge_two_2d_arrays_by_summing_values;

using std.collection;

# 两侧按 id 升序，双指针归并；同 id 合成一行，余部直接搬。
# 题内触发点: G3 —— 入参与返回值都是 `ArrayList<ArrayList<i64>>`，命中嵌套聚合 bridge 缺口。
[export(case: "camelCase")]
micro merge_arrays(nums1: ArrayList<ArrayList<i64>>, nums2: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let length_one: usize = nums1.length()
    let length_two: usize = nums2.length()
    let mut merged: ArrayList<ArrayList<i64>> = ArrayList::new(length_one + length_two)
    let mut i: usize = 0
    let mut j: usize = 0
    while i < length_one && j < length_two {
        let left: ArrayList<i64> = nums1⁅i⁆
        let right: ArrayList<i64> = nums2⁅j⁆
        if left⁅0⁆ < right⁅0⁆ {
            let mut row: ArrayList<i64> = ArrayList::new(2)
            row.push(left⁅0⁆)
            row.push(left⁅1⁆)
            merged.push(row)
            i = i + 1
        } else if left⁅0⁆ > right⁅0⁆ {
            let mut row: ArrayList<i64> = ArrayList::new(2)
            row.push(right⁅0⁆)
            row.push(right⁅1⁆)
            merged.push(row)
            j = j + 1
        } else {
            let mut row: ArrayList<i64> = ArrayList::new(2)
            row.push(left⁅0⁆)
            row.push(left⁅1⁆ + right⁅1⁆)
            merged.push(row)
            i = i + 1
            j = j + 1
        }
    }
    while i < length_one {
        let left: ArrayList<i64> = nums1⁅i⁆
        let mut row: ArrayList<i64> = ArrayList::new(2)
        row.push(left⁅0⁆)
        row.push(left⁅1⁆)
        merged.push(row)
        i = i + 1
    }
    while j < length_two {
        let right: ArrayList<i64> = nums2⁅j⁆
        let mut row: ArrayList<i64> = ArrayList::new(2)
        row.push(right⁅0⁆)
        row.push(right⁅1⁆)
        merged.push(row)
        j = j + 1
    }
    return merged
}

class Solution {
    micro mergeArrays(self, nums1: ArrayList<ArrayList<i64>>, nums2: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return merge_arrays(nums1, nums2)
    }
}
