namespace leetcode.minimum_fuel_cost_to_report_to_the_capital;

using std.collection;

# 以 0 号城市为根建树，自底向上累加子树人数：每条边上的车数 = ceil(子树人数 / seats)。
[export(case: "camelCase")]
micro minimumFuelCost(roads: ArrayList<ArrayList<i64>>, seats: i64) -> i64 {
    let count: usize = roads.length() + 1

    let mut adjacency: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        adjacency.push(ArrayList::new(0))
        fill = fill + 1
    }

    let mut index: usize = 0
    while index < roads.length() {
        let road: ArrayList<i64> = roads⁅index⁆
        let left: i64 = road⁅0⁆
        let right: i64 = road⁅1⁆

        let mut forward: ArrayList<i64> = adjacency⁅left as usize⁆
        forward.push(right)
        adjacency.set((left + 1) as isize, forward)

        let mut backward: ArrayList<i64> = adjacency⁅right as usize⁆
        backward.push(left)
        adjacency.set((right + 1) as isize, backward)

        index = index + 1
    }

    let mut parent: ArrayList<i64> = ArrayList::new(count)
    let mut order: ArrayList<i64> = ArrayList::new(count)
    let mut size: ArrayList<i64> = ArrayList::new(count)
    fill = 0
    while fill < count {
        parent.push(-1)
        size.push(1)
        fill = fill + 1
    }

    parent.set(1, 0)
    order.push(0)
    let mut queue: Deque<i64> = Deque::new()
    queue.push_back(0)

    while queue.is_empty() == false {
        let city: i64 = queue.pop_front().unwrap()
        let links: ArrayList<i64> = adjacency⁅city as usize⁆
        let mut cursor: usize = 0
        while cursor < links.length() {
            let next: i64 = links⁅cursor⁆
            if next != parent⁅city as usize⁆ {
                parent.set((next + 1) as isize, city)
                order.push(next)
                queue.push_back(next)
            }
            cursor = cursor + 1
        }
    }

    let mut fuel: i64 = 0
    let mut position: usize = order.length() - 1
    while position > 0 {
        let city: i64 = order⁅position⁆
        let subtree: i64 = size⁅city as usize⁆
        fuel = fuel + (subtree + seats - 1) / seats
        let host: i64 = parent⁅city as usize⁆
        size.set((host + 1) as isize, size⁅host as usize⁆ + subtree)
        position = position - 1
    }

    return fuel
}

class Solution {
    micro minimumFuelCost(self, roads: ArrayList<ArrayList<i64>>, seats: i64): i64 {
        return minimumFuelCost(roads, seats)
    }
}
