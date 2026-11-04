namespace leetcode.count_the_number_of_complete_components;

# 完全分量：分量内点对数等于边数。合并后按根分别聚合点数与边数再判定。
[export(case: "camelCase")]
micro count_complete_components(n: i64, edges: ArrayList<ArrayList<i64>>) -> i64 {
    let mut sets: DisjointSet<i64> = DisjointSet::new()
    let mut node: i64 = 0
    while node < n {
        sets.add(node)
        node = node + 1
    }

    loop edge in edges {
        sets.union(edge⁅0⁆, edge⁅1⁆)
    }

    let mut vertices: HashMap<i64, i64> = HashMap::new(n as usize)
    let mut links: HashMap<i64, i64> = HashMap::new(edges.length())
    node = 0
    while node < n {
        let root: i64 = sets.find_root(node)
        if vertices.contains_key(root) {
            vertices.insert(root, vertices.get(root).unwrap() + 1)
        } else {
            vertices.insert(root, 1)
        }
        node = node + 1
    }

    loop edge in edges {
        let root: i64 = sets.find_root(edge⁅0⁆)
        if links.contains_key(root) {
            links.insert(root, links.get(root).unwrap() + 1)
        } else {
            links.insert(root, 1)
        }
    }

    let mut complete: i64 = 0
    loop root in vertices.keys() {
        let member_count: i64 = vertices.get(root).unwrap()
        let mut link_count: i64 = 0
        if links.contains_key(root) {
            link_count = links.get(root).unwrap()
        }
        if link_count == member_count * (member_count - 1) / 2 {
            complete = complete + 1
        }
    }
    return complete
}

class Solution {
    micro countCompleteComponents(self, n: i64, edges: ArrayList<ArrayList<i64>>): i64 {
        return count_complete_components(n, edges)
    }
}
