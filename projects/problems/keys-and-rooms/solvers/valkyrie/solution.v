namespace leetcode.keys_and_rooms;

using std.collection;

# 房间钥匙构成有向图：从 0 号房 BFS，可达房间数等于房间总数即可全部进入。
[export(case: "camelCase")]
micro can_visit_all_rooms(rooms: ArrayList<ArrayList<i64>>) -> bool {
    let n: usize = rooms.length()
    let mut network: DirectedGraph<i64> = DirectedGraph::new()
    let mut i: usize = 0
    while i < n {
        network.add_node(i as i64)
        let keys: ArrayList<i64> = rooms⁅i⁆
        let mut k: usize = 0
        while k < keys.length() {
            network.add_edge(i as i64, keys⁅k⁆)
            k = k + 1
        }
        i = i + 1
    }

    let start: i64 = 0
    let visited: ArrayList<i64> = network.bfs(start)
    return visited.length() == n
}

class Solution {
    micro canVisitAllRooms(self, rooms: ArrayList<ArrayList<i64>>): bool {
        return can_visit_all_rooms(rooms)
    }
}
