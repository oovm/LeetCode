namespace leetcode.two_sum_less_than_k;

using std.collection;

# 拷贝排序后双指针：和 < k 时记录并左移收紧上界，否则右移降和。O(n log n)。
[export(case: "camelCase")]
micro twoSumLessThanK(nums: ArrayList<i64>, k: i64) -> i64 {
    let mut sorted: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        sorted.push(value)
    }
    sort(sorted)
    let mut lo: usize = 0
    let mut hi: usize = sorted.length() - 1
    let mut best: i64 = -1
    while lo < hi {
        let sum: i64 = sorted⁅lo⁆ + sorted⁅hi⁆
        if sum < k {
            if sum > best {
                best = sum
            }
            lo = lo + 1
        } else {
            if hi == 0 {
                break
            }
            hi = hi - 1
        }
    }
    return best
}

class Solution {
    micro twoSumLessThanK(self, nums: ArrayList<i64>, k: i64): i64 {
        return twoSumLessThanK(nums, k)
    }
}
