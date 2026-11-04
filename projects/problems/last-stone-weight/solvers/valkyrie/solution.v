namespace leetcode.last_stone_weight;

using std.collection;

# BinaryHeap 只有最小序，且比较用裸 `<` / `>=` 没有约束（G15 的第二实例）。
# 取两块最重的石头需要最大序堆，理想入口是 BinaryHeap::max() 或带比较器的构造。
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
