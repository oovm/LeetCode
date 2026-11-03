namespace leetcode.longest_increasing_subsequence;

# tails[k] 保存长度为 k+1 的上升子序列的最小结尾值。
[export(case: "camelCase")]
micro length_of_l_i_s(nums: ArrayList<i64>) -> i64 {
    let mut tails: ArrayList<i64> = ArrayList::new(0)
    loop x in nums {
        let len: usize = tails.length()
        let mut lo: usize = 0
        let mut hi: usize = len
        while lo < hi {
            let mid: usize = (lo + hi) / 2
            if tails⁅mid⁆.unwrap() < x {
                lo = mid + 1
            } else {
                hi = mid
            }
        }
        if lo < len {
            tails⁅lo⁆ = x
        } else {
            tails.push(x)
        }
    }
    return tails.length() as i64
}

class Solution {
    micro lengthOfLIS(self, nums: ArrayList<i64>): i64 {
        return length_of_l_i_s(nums)
    }
}
