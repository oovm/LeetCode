namespace leetcode.shortest_subarray_with_sum_at_least_k;

using std.collection;

# 前缀和 + 单调递增双端队列：
# 队尾保持前缀和递增（更小且更晚的前缀一定更优），队首一旦满足 cur - prefix[front] >= k
# 就弹出并记录长度。O(n) 时间 / O(n) 额外空间。
[export(case: "camelCase")]
micro shortest_subarray(nums: [i64], k: i64) -> i64 {
    let count: usize = nums.length()
    let mut prefix: ArrayList<i64> = ArrayList::new(count + 1)
    prefix.push(0)
    let mut i: usize = 0
    while i < count {
        prefix.push(prefix⁅i⁆ + nums⁅i⁆)
        i = i + 1
    }

    let mut window: Deque<i64> = Deque::new()
    let mut best: i64 = -1
    let mut j: i64 = 0
    while j <= count as i64 {
        let current: i64 = prefix⁅j as usize⁆

        let mut shrinking: bool = true
        while shrinking && !window.is_empty() {
            let front: i64 = window.peek_front().unwrap()
            if current - prefix⁅front as usize⁆ >= k {
                window.pop_front()
                let span: i64 = j - front
                if best < 0 || span < best {
                    best = span
                }
            } else {
                shrinking = false
            }
        }

        while !window.is_empty() && prefix⁅window.peek_back().unwrap() as usize⁆ >= current {
            window.pop_back()
        }
        window.push_back(j)
        j = j + 1
    }
    return best
}

class Solution {
    micro shortestSubarray(self, nums: [i64], k: i64): i64 {
        return shortest_subarray(nums, k)
    }
}
