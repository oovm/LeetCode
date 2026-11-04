namespace leetcode.total_cost_to_hire_k_workers;

using std.collection;

# 下标堆 + 捕获 `costs` 的比较器：最小值按工资，同工资按下标。
# 两端各维护 `candidates` 个候选，取出后从同侧补位。
[export(case: "camelCase")]
micro totalCost(costs: ArrayList<i64>, k: i64, candidates: i64) -> i64 {
    let count: usize = costs.length()
    let mut heap: BinaryHeap<i64> = BinaryHeap::new_by(micro(a: i64, b: i64) -> i32 {
        let left: usize = a as usize
        let right: usize = b as usize
        if costs⁅left⁆ != costs⁅right⁆ {
            if costs⁅left⁆ < costs⁅right⁆ {
                return -1
            }
            return 1
        }
        if a < b {
            return -1
        }
        if a > b {
            return 1
        }
        return 0
    })

    let mut left: usize = 0
    let mut right: usize = count
    let mut added: i64 = 0
    while added < candidates && left < right {
        heap.push(left as i64)
        left = left + 1
        added = added + 1
    }
    added = 0
    while added < candidates && right > left {
        right = right - 1
        heap.push(right as i64)
        added = added + 1
    }

    let mut total: i64 = 0
    let mut hired: i64 = 0
    while hired < k {
        let index: i64 = heap.pop().unwrap()
        let position: usize = index as usize
        total = total + costs⁅position⁆
        if position < left {
            if left < right {
                heap.push(left as i64)
                left = left + 1
            }
        } else {
            if right > left {
                right = right - 1
                heap.push(right as i64)
            }
        }
        hired = hired + 1
    }
    return total
}

class Solution {
    micro totalCost(self, costs: ArrayList<i64>, k: i64, candidates: i64): i64 {
        return totalCost(costs, k, candidates)
    }
}
