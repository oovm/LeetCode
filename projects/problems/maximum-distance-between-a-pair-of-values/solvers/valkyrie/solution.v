namespace leetcode.maximum_distance_between_a_pair_of_values;

using std.collection;

# 题面保证两个数组非递增，但生成用例存在非单调输入。
# 用「前缀最小值 + 二分」的推广形态：对每个右端点 `j`，
# 二分最小的 `i`，使 `nums1[0..i]` 的最小值不超过 `nums2[j]`。
[export(case: "camelCase")]
micro maxDistance(nums1: ArrayList<i64>, nums2: ArrayList<i64>) -> i64 {
    let n1: usize = nums1.length()
    if n1 == 0 || nums2.length() == 0 {
        return 0
    }

    let mut prefix_min: ArrayList<i64> = ArrayList::new(n1)
    let mut running: i64 = nums1⁅0⁆
    let mut index: usize = 0
    while index < n1 {
        if nums1⁅index⁆ < running {
            running = nums1⁅index⁆
        }
        prefix_min.push(running)
        index = index + 1
    }

    let mut best: i64 = 0
    let mut right: usize = 0
    while right < nums2.length() {
        let mut limit: usize = n1 - 1
        if right < n1 {
            limit = right
        }
        let target: i64 = nums2⁅right⁆
        if prefix_min⁅limit⁆ <= target {
            let mut low: usize = 0
            let mut high: usize = limit
            while low < high {
                let mid: usize = low + (high - low) / 2
                if prefix_min⁅mid⁆ <= target {
                    high = mid
                } else {
                    low = mid + 1
                }
            }
            let width: i64 = right as i64 - low as i64
            if width > best {
                best = width
            }
        }
        right = right + 1
    }
    return best
}

class Solution {
    micro maxDistance(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>): i64 {
        return maxDistance(nums1, nums2)
    }
}
