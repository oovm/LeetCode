namespace leetcode.min_cost_to_connect_all_points;

using std.collection;

# 稠密完全图用 Prim：每轮线性挑出离生成树最近的未访问点，总代价 O(n^2)，不需要堆。
[export(case: "camelCase")]
micro minCostConnectPoints(points: ArrayList<ArrayList<i64>>) -> i64 {
    let count: usize = points.length()
    let mut visited: ArrayList<bool> = ArrayList::new(count)
    let mut best: ArrayList<i64> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        visited.push(false)
        best.push(1000000000000)
        fill = fill + 1
    }
    best.set(1, 0)

    let mut total: i64 = 0
    let mut round: usize = 0
    while round < count {
        let mut pick: i64 = -1
        let mut cursor: usize = 0
        while cursor < count {
            if visited⁅cursor⁆ == false {
                if best⁅cursor⁆ != 1000000000000 {
                    if pick == -1 || best⁅cursor⁆ < best⁅pick as usize⁆ {
                        pick = cursor as i64
                    }
                }
            }
            cursor = cursor + 1
        }
        if pick == -1 {
            break
        }
        let pick_index: usize = pick as usize
        visited.set((pick + 1) as isize, true)
        total = total + best⁅pick_index⁆
        let origin: ArrayList<i64> = points⁅pick_index⁆
        let origin_x: i64 = origin⁅0⁆
        let origin_y: i64 = origin⁅1⁆
        let mut other: usize = 0
        while other < count {
            if visited⁅other⁆ == false {
                let target: ArrayList<i64> = points⁅other⁆
                let dx: i64 = origin_x - target⁅0⁆
                let dy: i64 = origin_y - target⁅1⁆
                let mut abs_dx: i64 = dx
                if abs_dx < 0 {
                    abs_dx = 0 - abs_dx
                }
                let mut abs_dy: i64 = dy
                if abs_dy < 0 {
                    abs_dy = 0 - abs_dy
                }
                let distance: i64 = abs_dx + abs_dy
                if distance < best⁅other⁆ {
                    let ordinal: isize = (other as i64 + 1) as isize
                    best.set(ordinal, distance)
                }
            }
            other = other + 1
        }
        round = round + 1
    }
    return total
}

class Solution {
    micro minCostConnectPoints(self, points: ArrayList<ArrayList<i64>>): i64 {
        return minCostConnectPoints(points)
    }
}
