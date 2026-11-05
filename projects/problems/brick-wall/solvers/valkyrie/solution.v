namespace leetcode.brick_wall;

using std.collection;

# 每条砖缝的横坐标出现次数就是「穿过该缝的墙层数」，取最多的缝穿墙最少。
# 每块砖只累加一次，O(砖数)。
[export(case: "camelCase")]
micro least_bricks(wall: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: i64 = wall.length() as i64
    let mut counts: HashMap<i64, i64> = HashMap::new(wall.length())
    let mut best: i64 = 0
    let mut row: usize = 0
    while row < wall.length() {
        let bricks: ArrayList<i64> = wall⁅row⁆
        let mut offset: i64 = 0
        let mut brick: usize = 0
        while brick + 1 < bricks.length() {
            offset = offset + bricks⁅brick⁆
            let mut amount: i64 = 1
            if counts.contains_key(offset) {
                amount = counts.get(offset).unwrap() + 1
            }
            counts.insert(offset, amount)
            if amount > best {
                best = amount
            }
            brick = brick + 1
        }
        row = row + 1
    }
    return rows - best
}

class Solution {
    micro leastBricks(self, wall: ArrayList<ArrayList<i64>>): i64 {
        return least_bricks(wall)
    }
}
