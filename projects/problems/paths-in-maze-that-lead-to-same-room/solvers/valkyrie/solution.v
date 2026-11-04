namespace leetcode.paths_in_maze_that_lead_to_same_room;

using std.collection;

# 统计无向图中的三角形：枚举每个房间的邻居对，再查两者是否相邻。
# 每个三角形被三个顶点各统计一次，最后总数除以 3。
[export(case: "camelCase")]
micro numberOfPaths(n: i64, corridors: ArrayList<ArrayList<i64>>) -> i64 {
    let count: usize = (n + 1) as usize
    let mut adjacency: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut linked: ArrayList<ArrayList<bool>> = ArrayList::new(count)

    let mut fill: usize = 0
    while fill < count {
        let mut row: ArrayList<i64> = ArrayList::new(0)
        adjacency.push(row)
        let mut flags: ArrayList<bool> = ArrayList::new(count)
        let mut col: usize = 0
        while col < count {
            flags.push(false)
            col = col + 1
        }
        linked.push(flags)
        fill = fill + 1
    }

    let mut index: usize = 0
    while index < corridors.length() {
        let corridor: ArrayList<i64> = corridors⁅index⁆
        let a: i64 = corridor⁅0⁆
        let b: i64 = corridor⁅1⁆
        let flags: ArrayList<bool> = linked⁅a as usize⁆
        if flags⁅b as usize⁆ == false {
            let mut from_flags: ArrayList<bool> = linked⁅a as usize⁆
            from_flags.set((b + 1) as isize, true)
            linked.set((a + 1) as isize, from_flags)
            let mut to_flags: ArrayList<bool> = linked⁅b as usize⁆
            to_flags.set((a + 1) as isize, true)
            linked.set((b + 1) as isize, to_flags)

            let mut from_rooms: ArrayList<i64> = adjacency⁅a as usize⁆
            from_rooms.push(b)
            adjacency.set((a + 1) as isize, from_rooms)
            let mut to_rooms: ArrayList<i64> = adjacency⁅b as usize⁆
            to_rooms.push(a)
            adjacency.set((b + 1) as isize, to_rooms)
        }
        index = index + 1
    }

    let mut total: i64 = 0
    let mut room: usize = 1
    while room < count {
        let neighbors: ArrayList<i64> = adjacency⁅room⁆
        let mut first: usize = 0
        while first < neighbors.length() {
            let mut second: usize = first + 1
            while second < neighbors.length() {
                let left: i64 = neighbors⁅first⁆
                let right: i64 = neighbors⁅second⁆
                let flags: ArrayList<bool> = linked⁅left as usize⁆
                if flags⁅right as usize⁆ {
                    total = total + 1
                }
                second = second + 1
            }
            first = first + 1
        }
        room = room + 1
    }
    return total / 3
}

class Solution {
    micro numberOfPaths(self, n: i64, corridors: ArrayList<ArrayList<i64>>): i64 {
        return numberOfPaths(n, corridors)
    }
}
