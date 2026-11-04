namespace leetcode.count_unreachable_pairs_of_nodes_in_an_undirected_graph;

# 不可达点对数 = 全部点对 - 各连通分量内部点对；分量用并查集合并。
[export(case: "camelCase")]
micro count_pairs(n: i64, edges: ArrayList<ArrayList<i64>>) -> i64 {
    let mut sets: DisjointSet<i64> = DisjointSet::new()
    let mut node: i64 = 0
    while node < n {
        sets.add(node)
        node = node + 1
    }

    loop edge in edges {
        sets.union(edge⁅0⁆, edge⁅1⁆)
    }

    # 分量规模：按根聚合元素个数。
    let mut sizes: HashMap<i64, i64> = HashMap::new(n as usize)
    loop member in sets.elements() {
        let root: i64 = sets.find_root(member)
        if sizes.contains_key(root) {
            sizes.insert(root, sizes.get(root).unwrap() + 1)
        } else {
            sizes.insert(root, 1)
        }
    }

    let mut intra_component: i64 = 0
    loop size in sizes.values() {
        intra_component = intra_component + size * (size - 1) / 2
    }

    let total: i64 = n * (n - 1) / 2
    return total - intra_component
}

class Solution {
    micro countPairs(self, n: i64, edges: ArrayList<ArrayList<i64>>): i64 {
        return count_pairs(n, edges)
    }
}
