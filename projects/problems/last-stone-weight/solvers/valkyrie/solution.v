namespace leetcode.last_stone_weight;

using std.collection;

# `BinaryHeap::max()` 为大顶堆，直接按重量入堆，堆顶即最重石头。
# 复核于 addon `9d51ad08`（2026-11-05）：本题真跑 124/124。
[export(case: "camelCase")]
micro last_stone_weight(stones: [i64]) -> i64 {
    let mut heap: BinaryHeap<i64> = BinaryHeap::max()
    loop stone in stones {
        heap.push(stone)
    }

    while heap.length() > 1 {
        let heaviest: i64 = heap.pop().unwrap()
        let second: i64 = heap.pop().unwrap()
        if heaviest != second {
            heap.push(heaviest - second)
        }
    }

    if heap.is_empty() {
        return 0
    }
    return heap.pop().unwrap()
}

class Solution {
    micro lastStoneWeight(self, stones: [i64]): i64 {
        return last_stone_weight(stones)
    }
}
