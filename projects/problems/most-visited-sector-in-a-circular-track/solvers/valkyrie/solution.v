namespace leetcode.most_visited_sector_in_a_circular_track;

using std.collection;

# 访问序列单调前进并环形回绕，覆盖区间只由首尾决定：末段不小于首段时是一段区间，否则跨环两段。
[export(case: "camelCase")]
micro mostVisited(n: i64, rounds: ArrayList<i64>) -> ArrayList<i64> {
    let mut answer: ArrayList<i64> = ArrayList::new(n as usize)
    let first: i64 = rounds⁅0⁆
    let last: i64 = rounds⁅rounds.length() - 1⁆
    if first <= last {
        let mut sector: i64 = first
        while sector <= last {
            answer.push(sector)
            sector = sector + 1
        }
    } else {
        let mut sector: i64 = 1
        while sector <= last {
            answer.push(sector)
            sector = sector + 1
        }
        sector = first
        while sector <= n {
            answer.push(sector)
            sector = sector + 1
        }
    }
    return answer
}

class Solution {
    micro mostVisited(self, n: i64, rounds: ArrayList<i64>): ArrayList<i64> {
        return mostVisited(n, rounds)
    }
}
