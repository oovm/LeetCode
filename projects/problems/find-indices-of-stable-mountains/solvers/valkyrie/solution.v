namespace leetcode.find_indices_of_stable_mountains;

using std.collection;

# 从下标 1 起，若左侧山高严格大于阈值则记该下标。
[export(case: "camelCase")]
micro stableMountains(height: ArrayList<i64>, threshold: i64) -> ArrayList<i64> {
    let mut result: ArrayList<i64> = ArrayList::new(height.length())
    let mut index: usize = 1
    while index < height.length() {
        if height⁅index - 1⁆ > threshold {
            result.push(index as i64)
        }
        index = index + 1
    }
    return result
}

class Solution {
    micro stableMountains(self, height: ArrayList<i64>, threshold: i64): ArrayList<i64> {
        return stableMountains(height, threshold)
    }
}
