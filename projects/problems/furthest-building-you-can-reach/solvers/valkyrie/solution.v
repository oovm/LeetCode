namespace leetcode.furthest_building_you_can_reach;

using std.collection;

# 大顶堆保存「准备用砖块付清」的楼层差。
# 砖块不够时，把其中最大的一跳改用砖块会超支，因此堆里取最小的那个由砖块承担：
# 这里用大顶堆存负值，弹出最大值即最小的一跳。
[export(case: "camelCase")]
micro furthestBuilding(heights: ArrayList<i64>, bricks: i64, ladders: i64) -> i64 {
    let mut heap: BinaryHeap<i64> = BinaryHeap::new_by(micro(a: i64, b: i64) -> i32 {
        if a > b {
            return -1
        }
        if a < b {
            return 1
        }
        return 0
    })
    let mut remaining: i64 = bricks
    let mut index: usize = 1
    while index < heights.length() {
        let difference: i64 = heights⁅index⁆ - heights⁅index - 1⁆
        if difference > 0 {
            heap.push(-difference)
            if heap.length() as i64 > ladders {
                let smallest: i64 = -heap.pop().unwrap()
                remaining = remaining - smallest
                if remaining < 0 {
                    return index as i64 - 1
                }
            }
        }
        index = index + 1
    }
    return heights.length() as i64 - 1
}

class Solution {
    micro furthestBuilding(self, heights: ArrayList<i64>, bricks: i64, ladders: i64): i64 {
        return furthestBuilding(heights, bricks, ladders)
    }
}
