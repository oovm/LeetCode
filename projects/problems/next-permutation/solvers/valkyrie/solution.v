namespace leetcode.next_permutation;

[export(case: "camelCase")]
micro next_permutation(nums: ArrayList<i64>) {
    let n: usize = nums.length()
    let mut i: usize = n - 1
    while i > 0 && nums⁅i - 1⁆.unwrap() >= nums⁅i⁆.unwrap() {
        i = i - 1
    }
    if i > 0 {
        let pivot: usize = i - 1
        let mut j: usize = n - 1
        while nums⁅j⁆.unwrap() <= nums⁅pivot⁆.unwrap() {
            j = j - 1
        }
        let tmp: i64 = nums⁅pivot⁆.unwrap()
        nums⁅pivot⁆ = nums⁅j⁆.unwrap()
        nums⁅j⁆ = tmp
    }
    let mut lo: usize = i
    let mut hi: usize = n - 1
    while lo < hi {
        let tmp2: i64 = nums⁅lo⁆.unwrap()
        nums⁅lo⁆ = nums⁅hi⁆.unwrap()
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
