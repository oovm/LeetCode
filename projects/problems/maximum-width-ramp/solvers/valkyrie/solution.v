namespace leetcode.maximum_width_ramp;

using std.collection;

# 单调递减下标栈：只保留下标值比栈顶更小的候选左端点。
# 再从右向左扫描，遇到不小于栈顶值的位置就更新宽度并弹栈。
[export(case: "camelCase")]
micro maxWidthRamp(nums: ArrayList<i64>) -> i64 {
    let mut stack: Deque<i64> = Deque::new()
    let mut index: usize = 0
    while index < nums.length() {
        let empty: bool = stack.is_empty()
        if empty {
            stack.push_back(index as i64)
        } else {
            let top: usize = stack.peek_back().unwrap() as usize
            if nums⁅index⁆ < nums⁅top⁆ {
                stack.push_back(index as i64)
            }
        }
        index = index + 1
    }

    let mut best: i64 = 0
    let mut right: i64 = nums.length() as i64 - 1
    while right >= 0 {
        while stack.is_empty() == false {
            let top: usize = stack.peek_back().unwrap() as usize
            if nums⁅top⁆ <= nums⁅right as usize⁆ {
                let width: i64 = right - top as i64
                if width > best {
                    best = width
                }
                stack.pop_back()
            } else {
                break
            }
        }
        right = right - 1
    }
    return best
}

class Solution {
    micro maxWidthRamp(self, nums: ArrayList<i64>): i64 {
        return maxWidthRamp(nums)
    }
}
