namespace leetcode.find_bottom_left_tree_value;

using std.collection;

# 层序遍历：每层推进前记下该层最左节点，最后一层的最左即答案。
[export(case: "camelCase")]
micro findBottomLeftValue(root: ArrayList<i64>) -> i64 {
    let mut answer: i64 = root⁅0⁆
    let mut level: ArrayList<i64> = ArrayList::new(1)
    level.push(0)
    while level.length() > 0 {
        answer = root⁅level⁅0⁆ as usize⁆
        let mut next: ArrayList<i64> = ArrayList::new(0)
        loop at in level {
            let left: i64 = 2 * at + 1
            let right: i64 = 2 * at + 2
            if left < root.length() as i64 {
                next.push(left)
            }
            if right < root.length() as i64 {
                next.push(right)
            }
        }
        level = next
    }
    return answer
}

class Solution {
    micro findBottomLeftValue(self, root: ArrayList<i64>): i64 {
        return findBottomLeftValue(root)
    }
}
