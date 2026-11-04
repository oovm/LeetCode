namespace leetcode.longest_continuous_subarray_with_absolute_diff_less_than_or_equal_to_limit;

using std.collection;

# 窗口极差 ≤ limit：两个单调双端队列各存下标，队首分别是窗口最大值与最小值。
# 队列存下标而不是值，收缩时按 `left` 精确出队，避免同值多份时误删。
[export(case: "camelCase")]
micro longestSubarray(nums: ArrayList<i64>, limit: i64) -> i64 {
    let mut max_queue: Deque<i64> = Deque::new()
    let mut min_queue: Deque<i64> = Deque::new()
    let mut left: usize = 0
    let mut best: i64 = 0
    let mut right: usize = 0
    while right < nums.length() {
        let mut keep_going: bool = true
        while keep_going && max_queue.is_empty() == false {
            let back: usize = max_queue.peek_back().unwrap() as usize
            if nums⁅back⁆ <= nums⁅right⁆ {
                max_queue.pop_back()
            }
            else {
                keep_going = false
            }
        }
        max_queue.push_back(right as i64)

        keep_going = true
        while keep_going && min_queue.is_empty() == false {
            let back: usize = min_queue.peek_back().unwrap() as usize
            if nums⁅back⁆ >= nums⁅right⁆ {
                min_queue.pop_back()
            }
            else {
                keep_going = false
            }
        }
        min_queue.push_back(right as i64)

        let mut within: bool = false
        while within == false {
            let max_index: usize = max_queue.peek_front().unwrap() as usize
            let min_index: usize = min_queue.peek_front().unwrap() as usize
            if nums⁅max_index⁆ - nums⁅min_index⁆ <= limit {
                within = true
            }
            else {
                if max_index == left {
                    max_queue.pop_front()
                }
                if min_index == left {
                    min_queue.pop_front()
                }
                left = left + 1
            }
        }

        let window: i64 = right as i64 - left as i64 + 1
        if window > best {
            best = window
        }
        right = right + 1
    }
    return best
}

class Solution {
    micro longestSubarray(self, nums: ArrayList<i64>, limit: i64): i64 {
        return longestSubarray(nums, limit)
    }
}
