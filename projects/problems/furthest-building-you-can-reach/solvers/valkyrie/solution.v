namespace leetcode.furthest_building_you_can_reach;

using std.collection;

# 最小堆里只保留「由梯子承担」的楼层差，堆大小不超过梯子数：
# 超出时弹出其中最小的一跳交给砖块，砖块不足即停在上一栋。
# `BinaryHeap::new()` 是最小序，这里直接用正值入堆，无需取负。
# 复核于 addon `9d51ad08`（2026-11-05）：`Ordering` 布局缺口已修，`BinaryHeap<i64>` 可用。
[export(case: "camelCase")]
micro furthestBuilding(heights: [i64], bricks: i64, ladders: i64) -> i64 {
    let mut heap: BinaryHeap<i64> = BinaryHeap::new()
    let mut remaining: i64 = bricks
    let mut index: usize = 1
    while index < heights.length() {
        let difference: i64 = heights⁅index⁆ - heights⁅index - 1⁆
        if difference > 0 {
            heap.push(difference)
            if (heap.length() as i64) > ladders {
                let smallest: i64 = heap.pop().unwrap()
                remaining = remaining - smallest
                if remaining < 0 {
                    return (index as i64) - 1
                }
            }
        }
        index = index + 1
    }
    return (heights.length() as i64) - 1
}

class Solution {
    micro furthestBuilding(self, heights: [i64], bricks: i64, ladders: i64): i64 {
        return furthestBuilding(heights, bricks, ladders)
    }
}
