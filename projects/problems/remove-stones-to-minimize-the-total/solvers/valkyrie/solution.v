namespace leetcode.remove_stones_to_minimize_the_total;

using std.collection;

# 理想堆序：大顶堆。`BinaryHeap::new_by(compare)` 是本批提出的缺失入口，
# 比较器返回负数表示先出堆。
[export(case: "camelCase")]
micro minStoneSum(piles: ArrayList<i64>, k: i64) -> i64 {
    let mut total: i64 = 0
    let mut heap: BinaryHeap<i64> = BinaryHeap::new_by(micro(a: i64, b: i64) -> i32 {
        if a > b {
            return -1
        }
        if a < b {
            return 1
        }
        return 0
    })
    loop pile in piles {
        total = total + pile
        heap.push(pile)
    }

    let mut step: i64 = 0
    while step < k {
        let top: i64 = heap.pop().unwrap()
        let removed: i64 = top / 2
        total = total - removed
        heap.push(top - removed)
        step = step + 1
    }
    return total
}

class Solution {
    micro minStoneSum(self, piles: ArrayList<i64>, k: i64): i64 {
        return minStoneSum(piles, k)
    }
}
