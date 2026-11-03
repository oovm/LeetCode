namespace leetcode.search_insert_position;

[export(case: "camelCase")]
micro search_insert(nums: ArrayList<i64>, target: i64) -> i64 {
    let mut lo: usize = 0
    let mut hi: usize = nums.length()
    while lo < hi {
        let mid: usize = (lo + hi) / 2
        let v: i64 = nums⁅mid⁆
        if v == target {
            return mid as i64
        }
        if v < target {
            lo = mid + 1
        } else {
            hi = mid
        }
    }
    return lo as i64
}

class Solution {
    micro searchInsert(self, nums: ArrayList<i64>, target: i64): i64 {
        return search_insert(nums, target)
    }
}
