namespace leetcode.walking_robot_simulation;

using std.collection;

# 障碍坐标编码成单个 64 位键放进 `HashSet`，每步做 O(1) 碰撞查询。
# 命令逐条执行，距离取过程中最大平方欧氏距离。
[export(case: "camelCase")]
micro robot_sim(commands: ArrayList<i64>, obstacles: ArrayList<ArrayList<i64>>) -> i64 {
    let mut blocked: HashSet<i64> = HashSet::new()
    let mut index: usize = 0
    while index < obstacles.length() {
        let row: i64 = obstacles⁅index⁆⁅0⁆
        let col: i64 = obstacles⁅index⁆⁅1⁆
        blocked.insert((row + 30000) * 65536 + (col + 30000))
        index = index + 1
    }
    let mut dx: ArrayList<i64> = ArrayList::new(4)
    let mut dy: ArrayList<i64> = ArrayList::new(4)
    dx.push(0)
    dx.push(1)
    dx.push(0)
    dx.push(-1)
    dy.push(1)
    dy.push(0)
    dy.push(-1)
    dy.push(0)
    let mut x: i64 = 0
    let mut y: i64 = 0
    let mut facing: i64 = 0
    let mut best: i64 = 0
    let mut step: usize = 0
    while step < commands.length() {
        let command: i64 = commands⁅step⁆
        if command == -1 {
            facing = (facing + 1) % 4
        } else if command == -2 {
            facing = (facing + 3) % 4
        } else {
            let mut remaining: i64 = command
            while remaining > 0 {
                let next_x: i64 = x + dx⁅facing as usize⁆
                let next_y: i64 = y + dy⁅facing as usize⁆
                if blocked.contains((next_x + 30000) * 65536 + (next_y + 30000)) {
                    break
                }
                x = next_x
                y = next_y
                let square: i64 = x * x + y * y
                if square > best {
                    best = square
                }
                remaining = remaining - 1
            }
        }
        step = step + 1
    }
    return best
}

class Solution {
    micro robotSim(self, commands: ArrayList<i64>, obstacles: ArrayList<ArrayList<i64>>): i64 {
        return robot_sim(commands, obstacles)
    }
}
