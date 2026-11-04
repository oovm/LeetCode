namespace leetcode.connecting_cities_with_minimum_cost;

using std.collection;

# 稠密图用 O(n^2) 的 Prim：邻接表存 [邻居, 成本]，每轮线性挑最小边。
[export(case: "camelCase")]
micro minimumCost(n: i64, connections: ArrayList<ArrayList<i64>>) -> i64 {
    let count: usize = n as usize + 1
    let mut adjacency: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        let mut row: ArrayList<i64> = ArrayList::new(0)
        adjacency.push(row)
        fill = fill + 1
    }
    let mut index: usize = 0
    while index < connections.length() {
        let edge: ArrayList<i64> = connections⁅index⁆
        let left: i64 = edge⁅0⁆
        let right: i64 = edge⁅1⁆
        let cost: i64 = edge⁅2⁆
        let mut forward: ArrayList<i64> = adjacency⁅left as usize⁆
        forward.push(right)
        forward.push(cost)
        adjacency.set((left + 1) as isize, forward)
        let mut backward: ArrayList<i64> = adjacency⁅right as usize⁆
        backward.push(left)
        backward.push(cost)
        adjacency.set((right + 1) as isize, backward)
        index = index + 1
    }

    let mut best: ArrayList<i64> = ArrayList::new(count)
    let mut used: ArrayList<bool> = ArrayList::new(count)
    fill = 0
    while fill < count {
        best.push(1000000000000000000)
        used.push(false)
        fill = fill + 1
    }
    best.set(2, 0)

    let mut total: i64 = 0
    let mut joined: i64 = 0
    let mut round: usize = 0
    while round < n as usize {
        let mut pick: i64 = -1
        let mut cursor: usize = 1
        while cursor < count {
            if used⁅cursor⁆ == false && best⁅cursor⁆ != 1000000000000000000 {
                if pick == -1 || best⁅cursor⁆ < best⁅pick as usize⁆ {
                    pick = cursor as i64
                }
            }
            cursor = cursor + 1
        }
        if pick == -1 {
            break
        }
        used.set((pick + 1) as isize, true)
        total = total + best⁅pick as usize⁆
        joined = joined + 1
        let links: ArrayList<i64> = adjacency⁅pick as usize⁆
        let mut offset: usize = 0
        while offset < links.length() {
            let next: i64 = links⁅offset⁆
            let cost: i64 = links⁅offset + 1⁆
            if used⁅next as usize⁆ == false && cost < best⁅next as usize⁆ {
                best.set((next + 1) as isize, cost)
            }
            offset = offset + 2
        }
        round = round + 1
    }
    if joined == n {
        return total
    }
    return -1
}

class Solution {
    micro minimumCost(self, n: i64, connections: ArrayList<ArrayList<i64>>): i64 {
        return minimumCost(n, connections)
    }
}
