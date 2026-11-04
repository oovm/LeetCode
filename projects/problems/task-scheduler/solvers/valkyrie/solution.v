namespace leetcode.task_scheduler;

using std.collection;

# 频次表 + 大顶堆按轮模拟。每轮最多执行 `n + 1` 个任务，剩余任务回堆。
# `HashMap<char, i64>` 依赖 `char: Hash`（G17）。
[export(case: "camelCase")]
micro leastInterval(tasks: ArrayList<char>, n: i64) -> i64 {
    let mut counts: HashMap<char, i64> = HashMap::new(64)
    loop task in tasks {
        let mut next: i64 = 1
        if counts.contains_key(task) {
            next = counts.get(task).unwrap() + 1
        }
        counts.insert(task, next)
    }

    let mut heap: BinaryHeap<i64> = BinaryHeap::new_by(micro(a: i64, b: i64) -> i32 {
        if a > b {
            return -1
        }
        if a < b {
            return 1
        }
        return 0
    })
    loop key in counts.keys() {
        heap.push(counts.get(key).unwrap())
    }

    let window: usize = (n + 1) as usize
    let mut time: i64 = 0
    while heap.length() > 0 {
        let mut processed: ArrayList<i64> = ArrayList::new(window)
        let mut executed: i64 = 0
        let mut cycle: usize = 0
        while cycle < window && heap.length() > 0 {
            let remaining: i64 = heap.pop().unwrap()
            if remaining > 1 {
                processed.push(remaining - 1)
            }
            executed = executed + 1
            cycle = cycle + 1
        }
        loop remaining in processed {
            heap.push(remaining)
        }
        if heap.length() > 0 {
            time = time + n + 1
        } else {
            time = time + executed
        }
    }
    return time
}

class Solution {
    micro leastInterval(self, tasks: ArrayList<char>, n: i64): i64 {
        return leastInterval(tasks, n)
    }
}
