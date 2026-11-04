namespace leetcode.minimum_number_of_coins_for_fruits;

using std.collection;

# `dp[i]`：买下前 i 个水果的最小花费。买第 j 个可覆盖 j..2j，
# 因此 `dp[i] = min(dp[j-1] + prices[j-1])`，j 落在 ceil(i/2)..i。
# 用单调递增的 `Deque` 维护该窗口内最小的 `dp[j-1] + prices[j-1]`。
[export(case: "camelCase")]
micro minimumCoins(prices: ArrayList<i64>) -> i64 {
    let count: usize = prices.length()

    let mut dp: ArrayList<i64> = ArrayList::new(count + 1)
    dp.push(0)
    let mut value: ArrayList<i64> = ArrayList::new(count + 1)
    value.push(0)

    let mut window: Deque<i64> = Deque::new()
    let mut index: usize = 1
    while index <= count {
        let current: i64 = dp⁅index - 1⁆ + prices⁅index - 1⁆
        value.push(current)

        while window.is_empty() == false {
            let back: usize = window.peek_back().unwrap() as usize
            if value⁅back⁆ < current {
                break
            }
            window.pop_back()
        }
        window.push_back(index as i64)

        let lower: usize = (index + 1) / 2
        while window.is_empty() == false {
            let front: usize = window.peek_front().unwrap() as usize
            if front >= lower {
                break
            }
            window.pop_front()
        }

        let best_index: usize = window.peek_front().unwrap() as usize
        dp.push(value⁅best_index⁆)
        index = index + 1
    }
    return dp⁅count⁆
}

class Solution {
    micro minimumCoins(self, prices: ArrayList<i64>): i64 {
        return minimumCoins(prices)
    }
}
