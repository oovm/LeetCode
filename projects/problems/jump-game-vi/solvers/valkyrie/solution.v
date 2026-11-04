namespace leetcode.jump_game_vi;

using std.collection;

# DP：`dp[i] = nums[i] + max(dp[j])`，j 落在最后 k 步内。
# 用单调递减的 `Deque` 维护窗口内的最大 dp 下标。
[export(case: "camelCase")]
micro maxResult(nums: ArrayList<i64>, k: i64) -> i64 {
    let count: usize = nums.length()
    let limit: usize = k as usize

    let mut dp: ArrayList<i64> = ArrayList::new(count)
    dp.push(nums⁅0⁆)

    let mut window: Deque<i64> = Deque::new()
    window.push_back(0)

    let mut index: usize = 1
    while index < count {
        while window.is_empty() == false {
            let front: usize = window.peek_front().unwrap() as usize
            if front + limit >= index {
                break
            }
            window.pop_front()
        }
        let best_index: usize = window.peek_front().unwrap() as usize
        let best: i64 = dp⁅best_index⁆
        dp.push(nums⁅index⁆ + best)
        while window.is_empty() == false {
            let back: usize = window.peek_back().unwrap() as usize
            if dp⁅back⁆ > dp⁅index⁆ {
                break
            }
            window.pop_back()
        }
        window.push_back(index as i64)
        index = index + 1
    }
    return dp⁅count - 1⁆
}

class Solution {
    micro maxResult(self, nums: ArrayList<i64>, k: i64): i64 {
        return maxResult(nums, k)
    }
}
