namespace leetcode.maximum_containers_on_a_ship;

# min(甲板格数 n², 载重预算内可装数 maxWeight / w)。
[export(case: "camelCase")]
micro max_containers(n: i64, w: i64, maxWeight: i64) -> i64 {
    let cells: i64 = n * n
    let affordable: i64 = maxWeight / w
    if cells < affordable {
        return cells
    }
    return affordable
}

class Solution {
    micro maxContainers(self, n: i64, w: i64, maxWeight: i64): i64 {
        return max_containers(n, w, maxWeight)
    }
}
