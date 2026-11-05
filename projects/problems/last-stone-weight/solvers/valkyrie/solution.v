namespace leetcode.last_stone_weight;

using std.collection;
using std.operator;

# std 的 `BinaryHeap::new()` 只有最小序（无 `max()`，也无带比较器的构造），
# 因此按常规手法把重量取负入堆：最小序的堆顶 = 最重石头的相反数。
# 复核于 addon `25132ccf`（2026-11-05）：`BinaryHeap<i64>` 仍阻断，build 失败诊断为
# `WASM pre-emission verifier: std::infix < at SSA value 2 携带无身份名义类型 Ordering；`
# `declaration / TypeId 缺失时不得按短名解析存储类`。
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
