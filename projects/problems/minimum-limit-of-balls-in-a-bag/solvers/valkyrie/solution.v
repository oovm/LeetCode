namespace leetcode.minimum_limit_of_balls_in_a_bag;

using std.collection;

# 二分答案：袋子上限越小，操作数越多；操作数关于上限单调递减。
# 一个袋子拆到每袋不超过 `size` 需要 `(count - 1) / size` 次操作。
micro operations(nums: ArrayList<i64>, size: i64) -> i64 {
    let mut total: i64 = 0
    loop count in nums {
        total = total + (count - 1) / size
    }
    return total
}

[export(case: "camelCase")]
micro minimumSize(nums: ArrayList<i64>, maxOperations: i64) -> i64 {
    let mut low: i64 = 1
    let mut high: i64 = 0
    loop count in nums {
        if count > high {
            high = count
        }
    }
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if operations(nums, mid) <= maxOperations {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return low
}

class Solution {
    micro minimumSize(self, nums: ArrayList<i64>, maxOperations: i64): i64 {
        return minimumSize(nums, maxOperations)
    }
}
