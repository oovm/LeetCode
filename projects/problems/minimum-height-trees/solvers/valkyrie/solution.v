namespace leetcode.minimum_height_trees;

using std.collection;

# 拓扑剥叶：每轮删掉全部度为 1 的叶子，最后一轮剩下的叶子就是最小高度树的根。
[export(case: "camelCase")]
micro findMinHeightTrees(n: i64, edges: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let count: usize = n as usize
    if count == 1 {
        let mut single: ArrayList<i64> = ArrayList::new(1)
        single.push(0)
        return single
    }

    let mut degree: ArrayList<i64> = ArrayList::new(count)
    let mut adjacency: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        degree.push(0)
        let mut row: ArrayList<i64> = ArrayList::new(0)
        adjacency.push(row)
        fill = fill + 1
    }

    let mut index: usize = 0
    while index < edges.length() {
        let edge: ArrayList<i64> = edges⁅index⁆
        let left: i64 = edge⁅0⁆
        let right: i64 = edge⁅1⁆
        let mut left_links: ArrayList<i64> = adjacency⁅left as usize⁆
        left_links.push(right)
        adjacency.set((left + 1) as isize, left_links)
        let mut right_links: ArrayList<i64> = adjacency⁅right as usize⁆
        right_links.push(left)
        adjacency.set((right + 1) as isize, right_links)
        degree.set((left + 1) as isize, degree⁅left as usize⁆ + 1)
        degree.set((right + 1) as isize, degree⁅right as usize⁆ + 1)
        index = index + 1
    }

    let mut queue: ArrayList<i64> = ArrayList::new(count)
    fill = 0
    while fill < count {
        if degree⁅fill⁆ == 1 {
            queue.push(fill as i64)
        }
        fill = fill + 1
    }

    let mut answer: ArrayList<i64> = ArrayList::new(count)
    let mut head: usize = 0
    while head < queue.length() {
        answer.clear()
        let level_size: usize = queue.length() - head
        let mut processed: usize = 0
        while processed < level_size {
            let node: i64 = queue⁅head⁆
            head = head + 1
            answer.push(node)
            let links: ArrayList<i64> = adjacency⁅node as usize⁆
            let mut cursor: usize = 0
            while cursor < links.length() {
                let neighbor: i64 = links⁅cursor⁆
                let remaining: i64 = degree⁅neighbor as usize⁆ - 1
                degree.set((neighbor + 1) as isize, remaining)
                if remaining == 1 {
                    queue.push(neighbor)
                }
                cursor = cursor + 1
            }
            processed = processed + 1
        }
    }
    return answer
}

class Solution {
    micro findMinHeightTrees(self, n: i64, edges: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return findMinHeightTrees(n, edges)
    }
}
