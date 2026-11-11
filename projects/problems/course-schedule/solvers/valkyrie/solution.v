namespace leetcode.course_schedule;

using std.collection;

# Kahn 拓扑排序：入度表 + 队列；处理完所有节点即无环。
[export(case: "camelCase")]
micro canFinish(numCourses: i64, prerequisites: [[i64]]) -> bool {
    let n: usize = numCourses as usize
    let mut indeg: ArrayList<i64> = ArrayList::new(n)
    let mut slot: usize = 0
    while slot < n {
        indeg.push(0)
        slot = slot + 1
    }
    loop edge in prerequisites {
        indeg⁅edge⁅0⁆ as usize⁆ = indeg⁅edge⁅0⁆ as usize⁆ + 1
    }
    let mut queue: ArrayList<i64> = ArrayList::new(0)
    slot = 0
    while slot < n {
        if indeg⁅slot⁆ == 0 {
            queue.push(slot as i64)
        }
        slot = slot + 1
    }
    let mut head: usize = 0
    let mut done: i64 = 0
    while head < queue.length() {
        let node: usize = queue⁅head⁆ as usize
        head = head + 1
        done = done + 1
        loop edge in prerequisites {
            if edge⁅1⁆ as usize == node {
                let next: usize = edge⁅0⁆ as usize
                indeg⁅next⁆ = indeg⁅next⁆ - 1
                if indeg⁅next⁆ == 0 {
                    queue.push(next as i64)
                }
            }
        }
    }
    return done == numCourses
}

class Solution {
    micro canFinish(self, numCourses: i64, prerequisites: [[i64]]): bool {
        return canFinish(numCourses, prerequisites)
    }
}
