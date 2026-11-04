namespace leetcode.validate_stack_sequences;

using std.collection;

# 用 ArrayList 当栈模拟入栈，栈顶与出栈序列当前元素相等时立即弹出。
[export(case: "camelCase")]
micro validateStackSequences(pushed: ArrayList<i64>, popped: ArrayList<i64>) -> bool {
    let mut stack: ArrayList<i64> = ArrayList::new(pushed.length())
    let mut cursor: usize = 0
    let mut index: usize = 0
    while index < pushed.length() {
        stack.push(pushed⁅index⁆)
        while stack.is_empty() == false && cursor < popped.length() && stack.last().unwrap() == popped⁅cursor⁆ {
            stack.pop()
            cursor = cursor + 1
        }
        index = index + 1
    }
    return stack.is_empty()
}

class Solution {
    micro validateStackSequences(self, pushed: ArrayList<i64>, popped: ArrayList<i64>): bool {
        return validateStackSequences(pushed, popped)
    }
}
