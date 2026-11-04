namespace leetcode.buildings_with_an_ocean_view;

using std.collection;

# 从右往左扫描，保留比当前最高还高的建筑，最后把下标栈翻转输出。
[export(case: "camelCase")]
micro findBuildings(heights: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = heights.length()
    let mut picked: ArrayList<i64> = ArrayList::new(count)
    let mut highest: i64 = -1
    let mut cursor: usize = count
    while cursor > 0 {
        let position: usize = cursor - 1
        if heights⁅position⁆ > highest {
            picked.push(position as i64)
            highest = heights⁅position⁆
        }
        cursor = cursor - 1
    }

    let mut result: ArrayList<i64> = ArrayList::new(picked.length())
    while picked.is_empty() == false {
        result.push(picked.pop().unwrap())
    }
    return result
}

class Solution {
    micro findBuildings(self, heights: ArrayList<i64>): ArrayList<i64> {
        return findBuildings(heights)
    }
}
