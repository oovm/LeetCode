namespace leetcode.pour_water;

using std.collection;

# 每单位水先向左找最低可停点（遇到更高就停），找不到再向右，仍找不到就落在 k。
# 单次 O(n)，总体 O(volume*n)，与题面小数据量一致。
[export(case: "camelCase")]
micro pour_water(heights: ArrayList<i64>, volume: i64, k: i64) -> ArrayList<i64> {
    let size: i64 = heights.length() as i64
    let mut remaining: i64 = volume
    while remaining > 0 {
        let mut target: i64 = k
        let mut cursor: i64 = k - 1
        while cursor >= 0 {
            if heights⁅cursor as usize⁆ > heights⁅target as usize⁆ {
                break
            }
            if heights⁅cursor as usize⁆ < heights⁅target as usize⁆ {
                target = cursor
            }
            cursor = cursor - 1
        }
        if target == k {
            cursor = k + 1
            while cursor < size {
                if heights⁅cursor as usize⁆ > heights⁅target as usize⁆ {
                    break
                }
                if heights⁅cursor as usize⁆ < heights⁅target as usize⁆ {
                    target = cursor
                }
                cursor = cursor + 1
            }
        }
        heights⁅target as usize⁆ = heights⁅target as usize⁆ + 1
        remaining = remaining - 1
    }
    return heights
}

class Solution {
    micro pourWater(self, heights: ArrayList<i64>, volume: i64, k: i64): ArrayList<i64> {
        return pour_water(heights, volume, k)
    }
}
