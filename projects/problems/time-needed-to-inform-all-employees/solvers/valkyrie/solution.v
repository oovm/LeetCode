namespace leetcode.time_needed_to_inform_all_employees;

using std.collection;

# 从 headID 往下 DFS，返回该子树的总通报时间。叶子不再消耗时间
# （数据里个别叶子的 `informTime` 非 0，这里按「通报到叶子即结束」处理）。
micro subtree_time(node: i64, adjacency: ArrayList<ArrayList<i64>>, informTime: ArrayList<i64>) -> i64 {
    let children: ArrayList<i64> = adjacency⁅node as usize⁆
    if children.length() == 0 {
        return 0
    }
    let mut longest: i64 = 0
    let mut index: usize = 0
    while index < children.length() {
        let candidate: i64 = subtree_time(children⁅index⁆, adjacency, informTime)
        if candidate > longest {
            longest = candidate
        }
        index = index + 1
    }
    return longest + informTime⁅node as usize⁆
}

[export(case: "camelCase")]
micro numOfMinutes(n: i64, headID: i64, manager: ArrayList<i64>, informTime: ArrayList<i64>) -> i64 {
    let count: usize = n as usize
    let mut adjacency: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        adjacency.push(ArrayList::new(0))
        index = index + 1
    }

    index = 0
    while index < count {
        let lead: i64 = manager⁅index⁆
        if lead >= 0 {
            let mut reports: ArrayList<i64> = adjacency⁅lead as usize⁆
            reports.push(index as i64)
            adjacency.set((lead + 1) as isize, reports)
        }
        index = index + 1
    }

    return subtree_time(headID, adjacency, informTime)
}

class Solution {
    micro numOfMinutes(self, n: i64, headID: i64, manager: ArrayList<i64>, informTime: ArrayList<i64>): i64 {
        return numOfMinutes(n, headID, manager, informTime)
    }
}
