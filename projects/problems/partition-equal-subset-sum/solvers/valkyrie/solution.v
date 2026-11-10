namespace leetcode.partition_equal_subset_sum;

using std.collection;

# 子集和 DP：总和折半，滚动布尔表降序更新；奇数和直接 false。
[export(case: "camelCase")]
micro canPartition(nums: ArrayList<i64>) -> bool {
    let mut sum: i64 = 0
    loop value in nums {
        sum = sum + value
    }
    if sum % 2 != 0 {
        return false
    }
    let half: usize = (sum / 2) as usize
    let mut dp: ArrayList<bool> = ArrayList::new(half + 1)
    let mut slot: usize = 0
    while slot <= half {
        dp.push(false)
        slot = slot + 1
    }
    dp⁅0⁆ = true
    loop value in nums {
        let mut s: i64 = half as i64
        while s >= value {
            if dp⁅(s - value) as usize⁆ {
                dp⁅s as usize⁆ = true
            }
            s = s - 1
        }
    }
    return dp⁅half⁆
}

class Solution {
    micro canPartition(self, nums: ArrayList<i64>): bool {
        return canPartition(nums)
    }
}
