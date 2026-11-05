namespace leetcode.the_earliest_moment_when_everyone_become_friends;

using std.collection;

micro compare_moment(a: ArrayList<i64>, b: ArrayList<i64>) -> i32 {
    if a⁅0⁆ < b⁅0⁆ {
        return -1
    }
    if a⁅0⁆ > b⁅0⁆ {
        return 1
    }
    return 0
}

# 按时间升序做并查集，组分数量降到 1 的那条日志时间即答案；否则 -1。
[export(case: "camelCase")]
micro earliest_acq(logs: ArrayList<ArrayList<i64>>, n: i64) -> i64 {
    let ordered: ArrayList<ArrayList<i64>> = sorted_by(logs, compare_moment)

    let mut sets: DisjointSet<i64> = DisjointSet::new()
    let mut node: i64 = 0
    while node < n {
        sets.add(node)
        node = node + 1
    }

    let mut groups: i64 = n
    let mut index: usize = 0
    while index < ordered.length() {
        let moment: i64 = ordered⁅index⁆⁅0⁆
        let left: i64 = ordered⁅index⁆⁅1⁆
        let right: i64 = ordered⁅index⁆⁅2⁆
        if !sets.connected(left, right) {
            sets.union(left, right)
            groups = groups - 1
            if groups == 1 {
                return moment
            }
        }
        index = index + 1
    }
    return -1
}

class Solution {
    micro earliestAcq(self, logs: ArrayList<ArrayList<i64>>, n: i64): i64 {
        return earliest_acq(logs, n)
    }
}
