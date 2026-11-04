namespace leetcode.maximal_network_rank;

# 秩 = 两端度数之和，若两城间已有公路则同一条边不重复计。
[export(case: "camelCase")]
micro maximal_network_rank(n: i64, roads: ArrayList<ArrayList<i64>>) -> i64 {
    let mut network: DirectedGraph<i64> = DirectedGraph::new()
    let mut city: i64 = 0
    while city < n {
        network.add_node(city)
        city = city + 1
    }

    loop road in roads {
        network.add_edge(road⁅0⁆, road⁅1⁆)
        network.add_edge(road⁅1⁆, road⁅0⁆)
    }

    let mut best: i64 = 0
    let mut a: i64 = 0
    while a < n {
        let mut b: i64 = a + 1
        while b < n {
            let mut rank: i64 = network.out_degree(a) as i64 + network.out_degree(b) as i64
            if network.has_edge(a, b) {
                rank = rank - 1
            }
            if rank > best {
                best = rank
            }
            b = b + 1
        }
        a = a + 1
    }
    return best
}

class Solution {
    micro maximalNetworkRank(self, n: i64, roads: ArrayList<ArrayList<i64>>): i64 {
        return maximal_network_rank(n, roads)
    }
}
