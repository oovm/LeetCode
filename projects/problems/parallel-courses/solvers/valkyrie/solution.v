namespace leetcode.parallel_courses;

using std.collection;

# 拓扑排序按层推进：每一层就是可并行修完的一个学期。
# 已修课程数不足 n 说明仍有环，返回 -1。
[export(case: "camelCase")]
micro minimumSemesters(n: i64, relations: ArrayList<ArrayList<i64>>) -> i64 {
    let count: usize = (n + 1) as usize
    let mut graph: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut indegree: ArrayList<i64> = ArrayList::new(count)

    let mut fill: usize = 0
    while fill < count {
        let mut row: ArrayList<i64> = ArrayList::new(0)
        graph.push(row)
        indegree.push(0)
        fill = fill + 1
    }

    let mut index: usize = 0
    while index < relations.length() {
        let relation: ArrayList<i64> = relations⁅index⁆
        let prev: i64 = relation⁅0⁆
        let next: i64 = relation⁅1⁆
        let mut outgoing: ArrayList<i64> = graph⁅prev as usize⁆
        outgoing.push(next)
        graph.set((prev + 1) as isize, outgoing)
        indegree.set((next + 1) as isize, indegree⁅next as usize⁆ + 1)
        index = index + 1
    }

    let mut queue: Deque<i64> = Deque::new()
    let mut node: usize = 1
    while node < count {
        if indegree⁅node⁆ == 0 {
            queue.push_back(node as i64)
        }
        node = node + 1
    }

    let mut semesters: i64 = 0
    let mut studied: i64 = 0
    while queue.is_empty() == false {
        let level: usize = queue.length()
        let mut step: usize = 0
        while step < level {
            let current: i64 = queue.pop_front().unwrap()
            studied = studied + 1
            let outgoing: ArrayList<i64> = graph⁅current as usize⁆
            let mut cursor: usize = 0
            while cursor < outgoing.length() {
                let next: i64 = outgoing⁅cursor⁆
                let remaining: i64 = indegree⁅next as usize⁆ - 1
                indegree.set((next + 1) as isize, remaining)
                if remaining == 0 {
                    queue.push_back(next)
                }
                cursor = cursor + 1
            }
            step = step + 1
        }
        semesters = semesters + 1
    }

    if studied == n {
        return semesters
    }
    return -1
}

class Solution {
    micro minimumSemesters(self, n: i64, relations: ArrayList<ArrayList<i64>>): i64 {
        return minimumSemesters(n, relations)
    }
}
