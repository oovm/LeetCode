namespace leetcode.next_greater_node_in_linked_list;

using std.collection;

# 从右向左维护单调递减栈，栈顶即右侧第一个更大的值。
[export(case: "camelCase")]
micro next_larger_nodes(head: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = head.length()
    let mut result: ArrayList<i64> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        result.push(0)
        fill = fill + 1
    }
    let mut stack: ArrayList<i64> = ArrayList::new(count)
    let mut cursor: i64 = count as i64 - 1
    while cursor >= 0 {
        let at: usize = cursor as usize
        let value: i64 = head⁅at⁆
        while stack.length() > 0 {
            let top: i64 = stack⁅stack.length() - 1⁆
            if top > value {
                break
            }
            stack.pop()
        }
        if stack.length() > 0 {
            result⁅at⁆ = stack⁅stack.length() - 1⁆
        }
        stack.push(value)
        cursor = cursor - 1
    }
    return result
}

class Solution {
    micro nextLargerNodes(self, head: ArrayList<i64>): ArrayList<i64> {
        return next_larger_nodes(head)
    }
}
