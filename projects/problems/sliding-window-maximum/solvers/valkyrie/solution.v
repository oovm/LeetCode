namespace leetcode.sliding_window_maximum;

using std.collection;

# 单调队列：Deque 只存下标，队首即窗口最大值。
[export(case: "camelCase")]
micro max_sliding_window(nums: [i64], k: i64) -> [i64] {
    let count: usize = nums.length()
    let width: usize = k as usize
    let mut result: ArrayList<i64> = ArrayList::new(count)
    let mut window: Deque<i64> = Deque::new()

    let mut i: usize = 0
    while i < count {
        while !window.is_empty() && nums⁅(window.peek_back().unwrap() as usize)⁆ <= nums⁅i⁆ {
            window.pop_back()
        }
        window.push_back(i as i64)

        if i >= width {
            while window.peek_front().unwrap() < (i - width + 1) as i64 {
                window.pop_front()
            }
        }

        if i + 1 >= width {
            result.push(nums⁅(window.peek_front().unwrap() as usize)⁆)
        }
        i = i + 1
    }
    return result.to_array()
}

class Solution {
    micro maxSlidingWindow(self, nums: [i64], k: i64): [i64] {
        return max_sliding_window(nums, k)
    }
}
