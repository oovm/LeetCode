namespace leetcode.search_in_rotated_sorted_array_ii;

using std.collection;

# 含重复旋转数组二分：lo/hi/mid 三点同值时两端收缩，否则按半侧有序性判落点。
[export(case: "camelCase")]
micro search(nums: ArrayList<i64>, target: i64) -> bool {
    let mut lo: i64 = 0
    let mut hi: i64 = nums.length() as i64 - 1
    while lo <= hi {
        let mid: i64 = (lo + hi) / 2
        let value: i64 = nums⁅mid as usize⁆
        if value == target {
            return true
        }
        if nums⁅lo as usize⁆ == value && value == nums⁅hi as usize⁆ {
            lo = lo + 1
            hi = hi - 1
        } else if nums⁅lo as usize⁆ <= value {
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
    return false
}

class Solution {
    micro search(self, nums: ArrayList<i64>, target: i64): bool {
        return search(nums, target)
    }
}
