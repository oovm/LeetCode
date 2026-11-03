namespace leetcode.next_permutation;

[export(case: "camelCase")]
micro next_permutation(nums: ArrayList<i64>) {
    let n: usize = nums.length()
    let mut i: usize = n - 1
    while i > 0 && nums⁅i - 1⁆ >= nums⁅i⁆ {
        i = i - 1
    }
    if i > 0 {
        let pivot: usize = i - 1
        let mut j: usize = n - 1
        while nums⁅j⁆ <= nums⁅pivot⁆ {
            j = j - 1
        }
        let tmp: i64 = nums⁅pivot⁆
        nums⁅pivot⁆ = nums⁅j⁆
        nums⁅j⁆ = tmp
    }
    let mut lo: usize = i
    let mut hi: usize = n - 1
    while lo < hi {
        let tmp2: i64 = nums⁅lo⁆
        nums⁅lo⁆ = nums⁅hi⁆
        nums⁅hi⁆ = tmp2
        lo = lo + 1
        hi = hi - 1
    }
}

class Solution {
    micro nextPermutation(self, nums: ArrayList<i64>) {
        next_permutation(nums)
    }
}
