namespace leetcode.most_profit_assigning_work;

using std.collection;

micro cmp_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 把难度与利润压进一个 64 位键（利润 < 16385）后排序，避免配对排序。
# 工人升序后单指针推进，同时维护当前可达最大利润，整体 O(n log n)。
[export(case: "camelCase")]
micro max_profit_assignment(difficulty: ArrayList<i64>, profit: ArrayList<i64>, mut worker: ArrayList<i64>) -> i64 {
    let mut jobs: ArrayList<i64> = ArrayList::new(difficulty.length())
    let mut index: usize = 0
    while index < difficulty.length() {
        jobs.push(difficulty⁅index⁆ * 16384 + profit⁅index⁆)
        index = index + 1
    }
    quick_sort(jobs, cmp_i64)
    quick_sort(worker, cmp_i64)
    let mut best: i64 = 0
    let mut cursor: usize = 0
    let mut total: i64 = 0
    let mut slot: usize = 0
    while slot < worker.length() {
        let ability: i64 = worker⁅slot⁆
        while cursor < jobs.length() && jobs⁅cursor⁆ / 16384 <= ability {
            let earned: i64 = jobs⁅cursor⁆ % 16384
            if earned > best {
                best = earned
            }
            cursor = cursor + 1
        }
        total = total + best
        slot = slot + 1
    }
    return total
}

class Solution {
    micro maxProfitAssignment(self, difficulty: ArrayList<i64>, profit: ArrayList<i64>, worker: ArrayList<i64>): i64 {
        return max_profit_assignment(difficulty, profit, worker)
    }
}
