namespace leetcode.positions_of_large_groups;

# 扫描每个连续相同字符段，长度 >= 3 记录 [start, end]。
[export(case: "camelCase")]
micro large_group_positions(s: utf8) -> [[i64]] {
    let n: usize = s.length()
    let mut result: ArrayList<[i64]> = ArrayList::new(0)
    let mut i: usize = 0
    while i < n {
        let mut j: usize = i
        while j < n && s⁅j⁆ == s⁅i⁆ {
            j = j + 1
        }
        if j - i >= 3 {
            let mut group: ArrayList<i64> = ArrayList::new(2)
            group.push(i as i64)
            group.push((j - 1) as i64)
            result.push(group.to_array())
        }
        i = j
    }
    return result.to_array()
}

class Solution {
    micro largeGroupPositions(self, s: utf8): [[i64]] {
        return large_group_positions(s)
    }
}
