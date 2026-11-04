namespace leetcode.maximal_score_after_applying_k_operations;

using std.collection;

# 大顶堆：每次取最大值累加分数，再把向上取整的三分之一放回。
[export(case: "camelCase")]
micro maxKelements(nums: ArrayList<i64>, k: i64) -> i64 {
    let mut heap: BinaryHeap<i64> = BinaryHeap::new_by(micro(a: i64, b: i64) -> i32 {
        if a > b {
            return -1
        }
        if a < b {
            return 1
        }
        return 0
    })
    loop value in nums {
        heap.push(value)
    }

    let mut score: i64 = 0
    let mut step: i64 = 0
    while step < k {
        let top: i64 = heap.pop().unwrap()
        score = score + top
        heap.push((top + 2) / 3)
        step = step + 1
    }
    return score
}

class Solution {
    micro maxKelements(self, nums: ArrayList<i64>, k: i64): i64 {
        return maxKelements(nums, k)
    }
}
