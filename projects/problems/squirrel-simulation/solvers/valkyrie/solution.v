namespace leetcode.squirrel_simulation;

using std.collection;

# 每颗坚果都要从树往返一次，只有第一颗由松鼠的起点出发；因此枚举第一颗坚果，
# 用总和扣掉「树→该坚果」再加「松鼠→该坚果」，O(坚果数)。
micro manhattan(a: ArrayList<i64>, b: ArrayList<i64>) -> i64 {
    let dr: i64 = a⁅0⁆ - b⁅0⁆
    let dc: i64 = a⁅1⁆ - b⁅1⁆
    let mut ar: i64 = dr
    if dr < 0 {
        ar = -dr
    }
    let mut ac: i64 = dc
    if dc < 0 {
        ac = -dc
    }
    return ar + ac
}

[export(case: "camelCase")]
micro min_distance(
    height: i64,
    width: i64,
    tree: ArrayList<i64>,
    squirrel: ArrayList<i64>,
    nuts: ArrayList<ArrayList<i64>>,
) -> i64 {
    let mut round_trip: i64 = 0
    let mut index: usize = 0
    while index < nuts.length() {
        round_trip = round_trip + 2 * manhattan(tree, nuts⁅index⁆)
        index = index + 1
    }

    let mut best: i64 = 0
    let mut ready: bool = false
    index = 0
    while index < nuts.length() {
        let nut: ArrayList<i64> = nuts⁅index⁆
        let from_tree: i64 = manhattan(tree, nut)
        let from_squirrel: i64 = manhattan(squirrel, nut)
        let candidate: i64 = round_trip - from_tree + from_squirrel
        if !ready || candidate < best {
            best = candidate
            ready = true
        }
        index = index + 1
    }
    return best
}

class Solution {
    micro minDistance(
        self,
        height: i64,
        width: i64,
        tree: ArrayList<i64>,
        squirrel: ArrayList<i64>,
        nuts: ArrayList<ArrayList<i64>>,
    ): i64 {
        return min_distance(height, width, tree, squirrel, nuts)
    }
}
