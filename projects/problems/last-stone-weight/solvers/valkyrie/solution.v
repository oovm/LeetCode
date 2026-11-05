namespace leetcode.last_stone_weight;

using std.collection;

# std 的 `BinaryHeap::new()` 只有最小序（无 `max()`，也无 `new_by` 带比较器的构造），
# 因此按常规手法把重量取负入堆：最小序的堆顶 = 最重石头的相反数。
# 复核于 addon `9d51ad08`（2026-11-05）：`Ordering` 布局缺口已修，`BinaryHeap<i64>` 可用，
# 本题真跑 124/124；保留取负是因为 std 仍缺最大序构造（`max()` / `new_by`），不是编译器阻断。
[export(case: "camelCase")]
micro last_stone_weight(stones: [i64]) -> i64 {
    let mut heap: BinaryHeap<i64> = BinaryHeap::new()
    loop stone in stones {
        heap.push(0 - stone)
    }

    while heap.length() > 1 {
        let heaviest: i64 = 0 - heap.pop().unwrap()
        let second: i64 = 0 - heap.pop().unwrap()
        if heaviest != second {
            heap.push(0 - (heaviest - second))
        }
    }

    if heap.is_empty() {
        return 0
    }
    return 0 - heap.pop().unwrap()
}

class Solution {
    micro lastStoneWeight(self, stones: [i64]): i64 {
        return last_stone_weight(stones)
    }
}
