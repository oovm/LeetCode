namespace leetcode.validate_binary_tree_nodes;

using std.collection;

# 先由入度确认唯一根，再从根做显式栈遍历，要求每个节点恰好访问一次且无环。
[export(case: "camelCase")]
micro validateBinaryTreeNodes(n: i64, leftChild: ArrayList<i64>, rightChild: ArrayList<i64>) -> bool {
    let count: usize = n as usize
    let mut indegree: ArrayList<i64> = ArrayList::new(count)
    let mut visited: ArrayList<bool> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        indegree.push(0)
        visited.push(false)
        fill = fill + 1
    }

    let mut i: usize = 0
    while i < count {
        let left: i64 = leftChild⁅i⁆
        if left != -1 {
            if left < 0 || left >= n {
                return false
            }
            let at: usize = left as usize
            let next: i64 = indegree⁅at⁆ + 1
            if next > 1 {
                return false
            }
            indegree.set((at + 1) as isize, next)
        }
        let right: i64 = rightChild⁅i⁆
        if right != -1 {
            if right < 0 || right >= n {
                return false
            }
            let at: usize = right as usize
            let next: i64 = indegree⁅at⁆ + 1
            if next > 1 {
                return false
            }
            indegree.set((at + 1) as isize, next)
        }
        i = i + 1
    }

    let mut root: i64 = -1
    i = 0
    while i < count {
        if indegree⁅i⁆ == 0 {
            if root != -1 {
                return false
            }
            root = i as i64
        }
        i = i + 1
    }
    if root == -1 {
        return false
    }

    let mut stack: Deque<i64> = Deque::new()
    stack.push_back(root)
    let mut seen: i64 = 0
    while stack.is_empty() == false {
        let node: i64 = stack.pop_back().unwrap()
        let at: usize = node as usize
        if visited⁅at⁆ {
            return false
        }
        visited.set((at + 1) as isize, true)
        seen = seen + 1
        let left: i64 = leftChild⁅at⁆
        if left != -1 {
            stack.push_back(left)
        }
        let right: i64 = rightChild⁅at⁆
        if right != -1 {
            stack.push_back(right)
        }
    }
    return seen == n
}

class Solution {
    micro validateBinaryTreeNodes(self, n: i64, leftChild: ArrayList<i64>, rightChild: ArrayList<i64>): bool {
        return validateBinaryTreeNodes(n, leftChild, rightChild)
    }
}
