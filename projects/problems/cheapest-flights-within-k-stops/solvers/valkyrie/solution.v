namespace leetcode.cheapest_flights_within_k_stops;

using std.collection;

# Bellman-Ford 的「最多 k 次中转」版本：每轮只允许再走一条边。
[export(case: "camelCase")]
micro findCheapestPrice(n: i64, flights: ArrayList<ArrayList<i64>>, src: i64, dst: i64, k: i64) -> i64 {
    let count: usize = n as usize
    let infinity: i64 = 1000000000000

    let mut dist: ArrayList<i64> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        dist.push(infinity)
        fill = fill + 1
    }
    dist.set((src + 1) as isize, 0)

    let mut stop: i64 = 0
    while stop <= k {
        let mut next: ArrayList<i64> = ArrayList::new(count)
        let mut copy: usize = 0
        while copy < count {
            next.push(dist⁅copy⁆)
            copy = copy + 1
        }

        let mut index: usize = 0
        while index < flights.length() {
            let flight: ArrayList<i64> = flights⁅index⁆
            let from: i64 = flight⁅0⁆
            let to: i64 = flight⁅1⁆
            let price: i64 = flight⁅2⁆
            let from_index: usize = from as usize
            if dist⁅from_index⁆ < infinity {
                let candidate: i64 = dist⁅from_index⁆ + price
                if candidate < next⁅to as usize⁆ {
                    next.set((to + 1) as isize, candidate)
                }
            }
            index = index + 1
        }

        copy = 0
        while copy < count {
            dist.set((copy + 1) as isize, next⁅copy⁆)
            copy = copy + 1
        }
        stop = stop + 1
    }

    if dist⁅dst as usize⁆ == infinity {
        return -1
    }
    return dist⁅dst as usize⁆
}

class Solution {
    micro findCheapestPrice(self, n: i64, flights: ArrayList<ArrayList<i64>>, src: i64, dst: i64, k: i64): i64 {
        return findCheapestPrice(n, flights, src, dst, k)
    }
}
