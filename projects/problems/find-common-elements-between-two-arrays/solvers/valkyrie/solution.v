namespace leetcode.find_common_elements_between_two_arrays;

using std.collection;

# 值域 0..1000 双桶存在性计数：逐值查另一侧桶即可，无需哈希容器。
[export(case: "camelCase")]
micro findIntersectionValues(nums1: ArrayList<i64>, nums2: ArrayList<i64>) -> ArrayList<i64> {
    let mut in1: ArrayList<i64> = ArrayList::new(1001)
    let mut in2: ArrayList<i64> = ArrayList::new(1001)
    let mut slot: usize = 0
    while slot <= 1000 {
        in1.push(0)
        in2.push(0)
        slot = slot + 1
    }
    loop value in nums1 {
        in1⁅value as usize⁆ = 1
    }
    loop value in nums2 {
        in2⁅value as usize⁆ = 1
    }
    let mut first: i64 = 0
    loop value in nums1 {
        if in2⁅value as usize⁆ == 1 {
            first = first + 1
        }
    }
    let mut second: i64 = 0
    loop value in nums2 {
        if in1⁅value as usize⁆ == 1 {
            second = second + 1
        }
    }
    let mut out: ArrayList<i64> = ArrayList::new(2)
    out.push(first)
    out.push(second)
    return out
}

class Solution {
    micro findIntersectionValues(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>): ArrayList<i64> {
        return findIntersectionValues(nums1, nums2)
    }
}
