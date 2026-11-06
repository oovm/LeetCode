namespace leetcode.find_the_peaks;

using std.collection;

# 严格局部极大值：左右邻居都更小才计入；按下标升序扫描，返回天然有序。
[export(case: "camelCase")]
micro findPeaks(mountain: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = mountain.length()
    let mut peaks: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 1
    while index + 1 < count {
        let left: i64 = mountain⁅index - 1⁆
        let current: i64 = mountain⁅index⁆
        let right: i64 = mountain⁅index + 1⁆
        if left < current && current > right {
            peaks.push(index as i64)
        }
        index = index + 1
    }
    return peaks
}

class Solution {
    micro findPeaks(self, mountain: ArrayList<i64>): ArrayList<i64> {
        return findPeaks(mountain)
    }
}
