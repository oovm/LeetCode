namespace leetcode.network_delay_time;

using std.collection;

# Bellman-Ford：以起点为源做 n-1 轮松弛，取所有节点最短路的最大值。
[export(case: "camelCase")]
micro networkDelayTime(times: ArrayList<ArrayList<i64>>, n: i64, k: i64) -> i64 {
    let count: usize = n as usize
    let infinity: i64 = 1000000000000

    let mut dist: ArrayList<i64> = ArrayList::new(count + 1)
    let mut fill: usize = 0
    while fill <= count {
        dist.push(infinity)
        fill = fill + 1
    }
    dist.set((k + 1) as isize, 0)

    let mut round: usize = 0
    while round + 1 < count {
        let mut changed: bool = false
        let mut index: usize = 0
        while index < times.length() {
            let edge: ArrayList<i64> = times⁅index⁆
            let from: i64 = edge⁅0⁆
            let to: i64 = edge⁅1⁆
            let weight: i64 = edge⁅2⁆
            let from_index: usize = from as usize
            let to_index: usize = to as usize
            if dist⁅from_index⁆ < infinity {
                let candidate: i64 = dist⁅from_index⁆ + weight
                if candidate < dist⁅to_index⁆ {
                    dist.set((to + 1) as isize, candidate)
                    changed = true
                }
            }
            index = index + 1
        }
        if changed == false {
            break
        }
        round = round + 1
    }

    let mut worst: i64 = 0
    let mut node: usize = 1
    while node <= count {
        if dist⁅node⁆ == infinity {
            return -1
        }
        if dist⁅node⁆ > worst {
            worst = dist⁅node⁆
        }
        node = node + 1
    }
    return worst
}

class Solution {
    micro networkDelayTime(self, times: ArrayList<ArrayList<i64>>, n: i64, k: i64): i64 {
        return networkDelayTime(times, n, k)
    }
}
