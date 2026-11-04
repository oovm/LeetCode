namespace leetcode.number_of_operations_to_make_network_connected;

using std.collection;

# 并查集求连通分量；多余边数够不够把各分量串起来。
[export(case: "camelCase")]
micro makeConnected(n: i64, connections: ArrayList<ArrayList<i64>>) -> i64 {
    let count: usize = n as usize
    let mut dsu: DisjointSet<i64> = DisjointSet::new()

    let mut index: usize = 0
    while index < count {
        dsu.add(index as i64)
        index = index + 1
    }

    let mut used: i64 = 0
    index = 0
    while index < connections.length() {
        let link: ArrayList<i64> = connections⁅index⁆
        let left: i64 = link⁅0⁆
        let right: i64 = link⁅1⁆
        if dsu.connected(left, right) == false {
            dsu.union(left, right)
        } else {
            used = used + 1
        }
        index = index + 1
    }

    let groups: i64 = dsu.group_count() as i64
    let needed: i64 = groups - 1
    if used >= needed {
        return needed
    }
    return -1
}

class Solution {
    micro makeConnected(self, n: i64, connections: ArrayList<ArrayList<i64>>): i64 {
        return makeConnected(n, connections)
    }
}
