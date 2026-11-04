namespace leetcode.solution

using std.collection

# 环形取三连点：`colors[i]` 与 `colors[i+1]` 不同、且 `colors[i+1]` 与 `colors[i+2]` 不同，
# 就以 `i` 开头形成一个长度为 3 的交替组。下标越过末尾就回到 0，首尾相接。
class Solution {
    [export(case: "numberOfAlternatingGroups")]
    micro numberOfAlternatingGroups(colors: ArrayList<i64>) -> i64 {
        let count: usize = colors.length()
        if count < 3 {
            return 0
        }
        let mut groups: i64 = 0
        let mut index: usize = 0
        while index < count {
            let mut next: usize = index + 1
            if next == count {
                next = 0
            }
            let mut after: usize = index + 2
            if after >= count {
                after = after - count
            }
            let first: i64 = colors⁅index⁆
            let second: i64 = colors⁅next⁆
            let third: i64 = colors⁅after⁆
            if first != second && second != third {
                groups = groups + 1
            }
            index = index + 1
        }
        return groups
    }
}
