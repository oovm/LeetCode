namespace leetcode.number_of_ways_to_arrive_at_destination;

using std.collection;

# 先把重边按两端点去重（保留最小耗时），再用朴素 Dijkstra（O(n^2 + E)）：
# 距离更短则重置方案数，距离相等则方案数累加取模。
[export(case: "camelCase")]
micro countPaths(n: i64, roads: ArrayList<ArrayList<i64>>) -> i64 {
    let count: usize = n as usize
    let infinity: i64 = 1000000000000000
    let modulus: i64 = 1000000007

    let mut edge_map: HashMap<i64, i64> = HashMap::new(16)
    let mut index: usize = 0
    while index < roads.length() {
        let road: ArrayList<i64> = roads⁅index⁆
        let left: i64 = road⁅0⁆
        let right: i64 = road⁅1⁆
        let duration: i64 = road⁅2⁆
        let small: i64 = if left < right { left } else { right }
        let large: i64 = if left < right { right } else { left }
        let key: i64 = small * n + large
        let mut keep: bool = true
        if edge_map.contains_key(key) {
            let previous: i64 = edge_map.get(key).unwrap()
            if previous <= duration {
                keep = false
            }
        }
        if keep {
            edge_map.insert(key, duration)
        }
        index = index + 1
    }

    let mut adjacency: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        adjacency.push(ArrayList::new(0))
        fill = fill + 1
    }

    let keys: ArrayList<i64> = edge_map.keys()
    index = 0
    while index < keys.length() {
        let key: i64 = keys⁅index⁆
        let left: i64 = key / n
        let right: i64 = key % n
        let duration: i64 = edge_map.get(key).unwrap()

        let mut forward: ArrayList<i64> = adjacency⁅left as usize⁆
        forward.push(right)
        forward.push(duration)
        adjacency.set((left + 1) as isize, forward)

        let mut backward: ArrayList<i64> = adjacency⁅right as usize⁆
        backward.push(left)
        backward.push(duration)
        adjacency.set((right + 1) as isize, backward)

        index = index + 1
    }

    let mut dist: ArrayList<i64> = ArrayList::new(count)
    let mut ways: ArrayList<i64> = ArrayList::new(count)
    let mut done: ArrayList<bool> = ArrayList::new(count)
    fill = 0
    while fill < count {
        dist.push(infinity)
        ways.push(0)
        done.push(false)
        fill = fill + 1
    }
    dist.set(1, 0)
    ways.set(1, 1)

    let mut round: usize = 0
    while round < count {
        let mut select: i64 = -1
        let mut best: i64 = infinity
        let mut cursor: usize = 0
        while cursor < count {
            if done⁅cursor⁆ == false && dist⁅cursor⁆ < best {
                best = dist⁅cursor⁆
                select = cursor as i64
            }
            cursor = cursor + 1
        }
        if select == -1 || best >= infinity {
            break
        }
        done.set((select + 1) as isize, true)
        if select == n - 1 {
            break
        }

        let links: ArrayList<i64> = adjacency⁅select as usize⁆
        let base_distance: i64 = dist⁅select as usize⁆
        let source_ways: i64 = ways⁅select as usize⁆
        let mut offset: usize = 0
        while offset < links.length() {
            let next: i64 = links⁅offset⁆
            let duration: i64 = links⁅offset + 1⁆
            let candidate: i64 = base_distance + duration
            if candidate < dist⁅next as usize⁆ {
                dist.set((next + 1) as isize, candidate)
                ways.set((next + 1) as isize, source_ways)
            } else if candidate == dist⁅next as usize⁆ {
                let merged: i64 = (ways⁅next as usize⁆ + source_ways) % modulus
                ways.set((next + 1) as isize, merged)
            }
            offset = offset + 2
        }

        round = round + 1
    }

    return ways⁅count - 1⁆
}

class Solution {
    micro countPaths(self, n: i64, roads: ArrayList<ArrayList<i64>>): i64 {
        return countPaths(n, roads)
    }
}
