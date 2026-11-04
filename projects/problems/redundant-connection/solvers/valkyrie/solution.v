namespace leetcode.redundant_connection;

using std.collection;

# 并查集：第一条让两端已连通的边就是多余边。
[export(case: "camelCase")]
micro findRedundantConnection(edges: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let mut dsu: DisjointSet<i64> = DisjointSet::new()
    let mut index: usize = 0
    while index < edges.length() {
        let edge: ArrayList<i64> = edges⁅index⁆
        let from: i64 = edge⁅0⁆
        let to: i64 = edge⁅1⁆
        if dsu.connected(from, to) {
            let mut result: ArrayList<i64> = ArrayList::new(2)
            result.push(from)
            result.push(to)
            return result
        }
        dsu.union(from, to)
        index = index + 1
    }
    return ArrayList::new(0)
}

class Solution {
    micro findRedundantConnection(self, edges: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return findRedundantConnection(edges)
    }
}
