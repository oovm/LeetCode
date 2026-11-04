namespace leetcode.furthest_building_you_can_reach;

using std.collection;

# std 的 `BinaryHeap::new()` 只有最小序（无 `new_by`），这里用负值入堆：
# 堆里保存「准备由梯子承担」的楼层差，堆顶 = 最大的一跳。
# 当梯子数不够时，弹出最大的一跳改由砖块承担；砖块不足即停在上一栋。
[export(case: "camelCase")]
micro furthestBuilding(heights: ArrayList<i64>, bricks: i64, ladders: i64) -> i64 {
    let mut heap: BinaryHeap<i64> = BinaryHeap::new()
    let mut remaining: i64 = bricks
    let mut index: usize = 1
    while index < heights.length() {
        let difference: i64 = heights⁅index⁆ - heights⁅index - 1⁆
        if difference > 0 {
            heap.push(0 - difference)
            if (heap.length() as i64) > ladders {
                let smallest: i64 = 0 - heap.pop().unwrap()
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
    micro furthestBuilding(self, heights: ArrayList<i64>, bricks: i64, ladders: i64): i64 {
        return furthestBuilding(heights, bricks, ladders)
    }
}
