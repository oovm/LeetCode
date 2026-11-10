namespace leetcode.search_in_rotated_sorted_array;

using std.collection;

# 旋转数组二分：mid 与 lo 同侧则左半有序，按 target 落点收缩；否则右半有序同理。i64 下标避免 usize 减穿。
[export(case: "camelCase")]
micro search(nums: ArrayList<i64>, target: i64) -> i64 {
    let mut lo: i64 = 0
    let mut hi: i64 = nums.length() as i64 - 1
    while lo <= hi {
        let mid: i64 = (lo + hi) / 2
        let value: i64 = nums⁅mid as usize⁆
        if value == target {
            return mid
        }
        if value >= nums⁅lo as usize⁆ {
            if target >= nums⁅lo as usize⁆ && target < value {
                hi = mid - 1
            } else {
                lo = mid + 1
            }
        } else {
            if target > value && target <= nums⁅hi as usize⁆ {
                lo = mid + 1
            } else {
                hi = mid - 1
            }
        }
    }
    return -1
}

class Solution {
    micro search(self, nums: ArrayList<i64>, target: i64): i64 {
        return search(nums, target)
    }
}
