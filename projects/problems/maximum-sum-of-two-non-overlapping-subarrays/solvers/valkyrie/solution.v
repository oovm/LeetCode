namespace leetcode.maximum_sum_of_two_non_overlapping_subarrays;

using std.collection;

# 前缀和 + 两个方向各扫一遍：每个分界点只取「此前该长度的最大窗口和」，
# 于是 O(n) 时间、O(n) 前缀。
[export(case: "camelCase")]
micro maxSumTwoNoOverlap(nums: ArrayList<i64>, firstLen: i64, secondLen: i64) -> i64 {
    let count: i64 = nums.length() as i64
    let mut prefix: ArrayList<i64> = ArrayList::new((count + 1) as usize)
    prefix.push(0)
    let mut i: i64 = 0
    while i < count {
        prefix.push(prefix⁅i as usize⁆ + nums⁅i as usize⁆)
        i = i + 1
    }

    let mut best: i64 = 0

    # firstLen 窗口在前，secondLen 窗口在后
    let mut best_first: i64 = 0 - 1000000000000000000
    let mut start: i64 = firstLen
    while start + secondLen <= count {
        let window_first: i64 = prefix⁅start as usize⁆ - prefix⁅(start - firstLen) as usize⁆
        if window_first > best_first {
            best_first = window_first
        }
        let window_second: i64 = prefix⁅(start + secondLen) as usize⁆ - prefix⁅start as usize⁆
        let candidate: i64 = best_first + window_second
        if candidate > best {
            best = candidate
        }
        start = start + 1
    }

    # secondLen 窗口在前，firstLen 窗口在后
    let mut best_second: i64 = 0 - 1000000000000000000
    start = secondLen
    while start + firstLen <= count {
        let window_second: i64 = prefix⁅start as usize⁆ - prefix⁅(start - secondLen) as usize⁆
        if window_second > best_second {
            best_second = window_second
        }
        let window_first: i64 = prefix⁅(start + firstLen) as usize⁆ - prefix⁅start as usize⁆
        let candidate: i64 = best_second + window_first
        if candidate > best {
            best = candidate
        }
        start = start + 1
    }

    return best
}

class Solution {
    micro maxSumTwoNoOverlap(self, nums: ArrayList<i64>, firstLen: i64, secondLen: i64): i64 {
        return maxSumTwoNoOverlap(nums, firstLen, secondLen)
    }
}
