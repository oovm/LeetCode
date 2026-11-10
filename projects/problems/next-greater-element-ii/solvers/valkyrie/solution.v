namespace leetcode.next_greater_element_ii;

using std.collection;

# 循环数组单调递减栈：扫两圈，第二圈只查栈不再入栈；出栈时以当前值为下一个更大元素。
[export(case: "camelCase")]
micro nextGreaterElements(nums: ArrayList<i64>) -> ArrayList<i64> {
    let n: usize = nums.length()
    let mut out: ArrayList<i64> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        out.push(-1)
        i = i + 1
    }
    let mut stack: ArrayList<i64> = ArrayList::new(0)
    let mut t: i64 = 0
    while t < 2 * n as i64 {
        let idx: usize = (t % n as i64) as usize
        while stack.length() > 0 && nums⁅stack⁅stack.length() - 1⁆ as usize⁆ < nums⁅idx⁆ {
            let top: Option<i64> = stack.remove(stack.length())
            let j: usize = top.unwrap() as usize
            out⁅j⁆ = nums⁅idx⁆
        }
        if t < n as i64 {
            stack.push(idx as i64)
        }
        t = t + 1
    }
    return out
}

class Solution {
    micro nextGreaterElements(self, nums: ArrayList<i64>): ArrayList<i64> {
        return nextGreaterElements(nums)
    }
}
