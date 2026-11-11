namespace leetcode.campus_bikes;

using std.collection;

micro compare_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

micro absolute(value: i64) -> i64 {
    if value < 0 {
        return 0 - value
    }
    return value
}

# 距离、工人号、车号压进单个 i64 键后一次排序，按题面字典序贪心分配。
# 键基数 1000 覆盖题面上限 100 台车 / 100 名工人。
[export(case: "camelCase")]
micro assign_bikes(workers: [[i64]], bikes: [[i64]]) -> [i64] {
    let n: i64 = workers.length() as i64
    let m: i64 = bikes.length() as i64

    let mut keys: ArrayList<i64> = ArrayList::new(workers.length() * bikes.length())
    let mut worker_index: i64 = 0
    while worker_index < n {
        let mut bike_index: i64 = 0
        while bike_index < m {
            let worker: [i64] = workers⁅worker_index as usize⁆
            let bike: [i64] = bikes⁅bike_index as usize⁆
            let distance: i64 = absolute(worker⁅0⁆ - bike⁅0⁆) + absolute(worker⁅1⁆ - bike⁅1⁆)
            keys.push(distance * 1000000 + worker_index * 1000 + bike_index)
            bike_index = bike_index + 1
        }
        worker_index = worker_index + 1
    }
    let ordered: ArrayList<i64> = sorted_by(keys, compare_i64)

    let mut worker_taken: ArrayList<i64> = ArrayList::new(workers.length())
    let mut bike_taken: ArrayList<i64> = ArrayList::new(bikes.length())
    let mut answer: ArrayList<i64> = ArrayList::new(workers.length())
    worker_index = 0
    while worker_index < n {
        worker_taken.push(0)
        answer.push(0)
        worker_index = worker_index + 1
    }
    worker_index = 0
    while worker_index < m {
        bike_taken.push(0)
        worker_index = worker_index + 1
    }

    let mut cursor: usize = 0
    while cursor < ordered.length() {
        let key: i64 = ordered⁅cursor⁆
        let bike_index: i64 = key % 1000
        let holder: i64 = (key % 1000000) / 1000
        if worker_taken⁅holder as usize⁆ == 0 {
            if bike_taken⁅bike_index as usize⁆ == 0 {
                worker_taken⁅holder as usize⁆ = 1
                bike_taken⁅bike_index as usize⁆ = 1
                answer⁅holder as usize⁆ = bike_index
            }
        }
        cursor = cursor + 1
    }
    return answer.to_array()
}

class Solution {
    micro assignBikes(self, workers: [[i64]], bikes: [[i64]]): [i64] {
        return assign_bikes(workers, bikes)
    }
}
