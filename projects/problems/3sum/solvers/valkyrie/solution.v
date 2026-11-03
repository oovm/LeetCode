namespace leetcode.three_sum;

using std.collection;

micro cmp_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro three_sum(mut nums: ArrayList<i64>) -> ArrayList<ArrayList<i64>> {
    quick_sort(nums, cmp_i64)
    let n: usize = nums.length()
    let mut ans: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    let mut i: usize = 0
    while i + 2 < n {
        let vi: i64 = nums⁅i⁆
        if vi > 0 {
            break
        }
        if i > 0 && nums⁅i⁆ == nums⁅i - 1⁆ {
            i = i + 1
            continue
        }
        let mut j: usize = i + 1
        let mut k: usize = n - 1
        while j < k {
            let sum: i64 = vi + nums⁅j⁆ + nums⁅k⁆
            if sum < 0 {
                j = j + 1
            } else if sum > 0 {
                k = k - 1
            } else {
                let mut triplet: ArrayList<i64> = ArrayList::new(3)
                triplet.push(nums⁅i⁆)
                triplet.push(nums⁅j⁆)
                triplet.push(nums⁅k⁆)
                ans.push(triplet)
                j = j + 1
                k = k - 1
                while j < k && nums⁅j⁆ == nums⁅j - 1⁆ {
                    j = j + 1
                }
                while j < k && nums⁅k⁆ == nums⁅k + 1⁆ {
                    k = k - 1
                }
            }
        }
        i = i + 1
    }
    return ans
}

class Solution {
    micro threeSum(self, nums: ArrayList<i64>): ArrayList<ArrayList<i64>> {
        return three_sum(nums)
    }
}
