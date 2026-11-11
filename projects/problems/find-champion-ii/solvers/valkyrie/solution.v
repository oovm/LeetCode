namespace leetcode.find_champion_ii;

using std.collection;

# 冠军是唯一没有入边的节点：统计入度后，入度为 0 的节点多于或少于一个都返回 -1。
[export(case: "camelCase")]
micro findChampion(n: i64, edges: [[i64]]) -> i64 {
    let count: usize = n as usize
    let mut indegree: ArrayList<i64> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        indegree.push(0)
        fill = fill + 1
    }

    let mut index: usize = 0
    while index < edges.length() {
        let edge: [i64] = edges⁅index⁆
        let target: i64 = edge⁅1⁆
        indegree.set((target + 1) as isize, indegree⁅target as usize⁆ + 1)
        index = index + 1
    }

    let mut champion: i64 = -1
    let mut zeros: i64 = 0
    let mut node: usize = 0
    while node < count {
        if indegree⁅node⁆ == 0 {
            zeros = zeros + 1
            champion = node as i64
        }
        node = node + 1
    }

    if zeros == 1 {
        return champion
    }
    return -1
}

class Solution {
    micro findChampion(self, n: i64, edges: [[i64]]): i64 {
        return findChampion(n, edges)
    }
}
