namespace leetcode.longest_univalue_path;

using std.collection;

# down[i] 表示从节点 i 向下同值延伸的最长边数。倒序计算（子节点下标更大），
# 答案取某个节点两条同值臂之和，O(n)。
[export(case: "camelCase")]
micro longest_univalue_path(root: ArrayList<i64>) -> i64 {
    let total: i64 = root.length() as i64
    if total == 0 {
        return 0
    }
    let mut down: ArrayList<i64> = ArrayList::new(total as usize)
    let mut index: i64 = 0
    while index < total {
        down.push(0)
        index = index + 1
    }
    let mut best: i64 = 0
    index = total - 1
    while index >= 0 {
        let left: i64 = index * 2 + 1
        let right: i64 = left + 1
        let mut arm_left: i64 = 0
        let mut arm_right: i64 = 0
        if left < total && root⁅left as usize⁆ == root⁅index as usize⁆ {
            arm_left = down⁅left as usize⁆ + 1
        }
        if right < total && root⁅right as usize⁆ == root⁅index as usize⁆ {
            arm_right = down⁅right as usize⁆ + 1
        }
        let longer: i64 = if arm_left > arm_right { arm_left } else { arm_right }
        down⁅index as usize⁆ = longer
        if arm_left + arm_right > best {
            best = arm_left + arm_right
        }
        index = index - 1
    }
    return best
}

class Solution {
    micro longestUnivaluePath(self, root: ArrayList<i64>): i64 {
        return longest_univalue_path(root)
    }
}
