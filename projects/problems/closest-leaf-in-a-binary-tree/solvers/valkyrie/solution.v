namespace leetcode.closest_leaf_in_a_binary_tree;

using std.collection;

# 堆式层序数组里邻居是父节点与两个子节点。从值为 k 的节点做 BFS，
# 首个没有子节点的节点就是最近叶子，O(n)。
[export(case: "camelCase")]
micro find_closest_leaf(root: ArrayList<i64>, k: i64) -> i64 {
    let total: i64 = root.length() as i64
    let mut start: i64 = -1
    let mut index: i64 = 0
    while index < total {
        if root⁅index as usize⁆ == k {
            start = index
            index = total
        } else {
            index = index + 1
        }
    }
    if start < 0 {
        return k
    }
    let mut visited: ArrayList<i64> = ArrayList::new(total as usize)
    index = 0
    while index < total {
        visited.push(0)
        index = index + 1
    }
    let mut queue: ArrayList<i64> = ArrayList::new(total as usize)
    queue.push(start)
    visited⁅start as usize⁆ = 1
    let mut head: usize = 0
    while head < queue.length() {
        let node: i64 = queue⁅head⁆
        head = head + 1
        let left: i64 = node * 2 + 1
        let right: i64 = left + 1
        if left >= total {
            return root⁅node as usize⁆
        }
        if node > 0 {
            let parent: i64 = (node - 1) / 2
            if visited⁅parent as usize⁆ == 0 {
                visited⁅parent as usize⁆ = 1
                queue.push(parent)
            }
        }
        if visited⁅left as usize⁆ == 0 {
            visited⁅left as usize⁆ = 1
            queue.push(left)
        }
        if right < total && visited⁅right as usize⁆ == 0 {
            visited⁅right as usize⁆ = 1
            queue.push(right)
        }
    }
    return k
}

class Solution {
    micro findClosestLeaf(self, root: ArrayList<i64>, k: i64): i64 {
        return find_closest_leaf(root, k)
    }
}
