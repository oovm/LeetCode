namespace leetcode.last_visited_integers;

using std.collection;

# 连续第 k 个 -1 取倒数第 k 个正整数；不足 k 个时补 -1。
[export(case: "camelCase")]
micro lastVisitedIntegers(nums: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut seen: ArrayList<i64> = ArrayList::new(count)
    let mut answer: ArrayList<i64> = ArrayList::new(count)
    let mut streak: i64 = 0
    let mut index: usize = 0
    while index < count {
        let value: i64 = nums⁅index⁆
        if value == -1 {
            streak = streak + 1
            if streak as usize <= seen.length() {
                answer.push(seen⁅seen.length() - streak as usize⁆)
            } else {
                answer.push(-1)
            }
        } else {
            seen.push(value)
            streak = 0
        }
        index = index + 1
    }
    return answer
}

class Solution {
    micro lastVisitedIntegers(self, nums: ArrayList<i64>): ArrayList<i64> {
        return lastVisitedIntegers(nums)
    }
}
