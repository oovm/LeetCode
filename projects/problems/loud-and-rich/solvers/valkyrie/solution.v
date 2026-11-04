namespace leetcode.loud_and_rich;

using std.collection;

# `graph[poorer]` 存「比 poorer 有钱的人」。对每个人做一次 DFS，
# 在可达集合中取 `quiet` 最小者。数据按扁平数组判答案（每个下标一项）。
[export(case: "camelCase")]
micro loudAndRich(richer: ArrayList<ArrayList<i64>>, quiet: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = quiet.length()

    let mut graph: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        graph.push(ArrayList::new(0))
        fill = fill + 1
    }

    let mut index: usize = 0
    while index < richer.length() {
        let relation: ArrayList<i64> = richer⁅index⁆
        let rich: i64 = relation⁅0⁆
        let poor: i64 = relation⁅1⁆
        let mut links: ArrayList<i64> = graph⁅poor as usize⁆
        links.push(rich)
        graph.set((poor + 1) as isize, links)
        index = index + 1
    }

    let mut result: ArrayList<i64> = ArrayList::new(count)
    let mut person: usize = 0
    while person < count {
        let mut visited: ArrayList<bool> = ArrayList::new(count)
        let mut mark: usize = 0
        while mark < count {
            visited.push(false)
            mark = mark + 1
        }

        let person_value: i64 = person as i64
        visited.set((person_value + 1) as isize, true)

        let mut stack: Deque<i64> = Deque::new()
        stack.push_back(person_value)
        let mut best: i64 = person_value

        while stack.is_empty() == false {
            let current: i64 = stack.pop_back().unwrap()
            if quiet⁅current as usize⁆ < quiet⁅best as usize⁆ {
                best = current
            }
            let links: ArrayList<i64> = graph⁅current as usize⁆
            let mut cursor: usize = 0
            while cursor < links.length() {
                let next: i64 = links⁅cursor⁆
                if visited⁅next as usize⁆ == false {
                    visited.set((next + 1) as isize, true)
                    stack.push_back(next)
                }
                cursor = cursor + 1
            }
        }

        result.push(best)
        person = person + 1
    }

    return result
}

class Solution {
    micro loudAndRich(self, richer: ArrayList<ArrayList<i64>>, quiet: ArrayList<i64>): ArrayList<i64> {
        return loudAndRich(richer, quiet)
    }
}
