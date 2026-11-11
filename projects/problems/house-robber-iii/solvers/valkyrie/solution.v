namespace leetcode.house_robber_iii;

using std.collection;

# 树 DP：返回 `[rob, not_rob]` 两值装进 `ArrayList<i64>`（元组返回面未实测，计数器数组同形）。
micro dfs(root: ArrayList<i64>, i: usize) -> ArrayList<i64> {
    if i >= root.length() {
        let mut zero: ArrayList<i64> = ArrayList::new(2)
        zero.push(0)
        zero.push(0)
        return zero
    }
    let left: ArrayList<i64> = dfs(root, 2 * i + 1)
    let right: ArrayList<i64> = dfs(root, 2 * i + 2)
    let rob: i64 = root⁅i⁆ + left⁅1⁆ + right⁅1⁆
    let mut skip_left: i64 = left⁅0⁆
    if left⁅1⁆ > skip_left {
        skip_left = left⁅1⁆
    }
    let mut skip: i64 = skip_left + right⁅0⁆
    if right⁅1⁆ > right⁅0⁆ {
        skip = skip_left + right⁅1⁆
    }
    let mut out: ArrayList<i64> = ArrayList::new(2)
    out.push(rob)
    out.push(skip)
    return out
}

[export(case: "camelCase")]
micro rob(root: ArrayList<i64>) -> i64 {
    let result: ArrayList<i64> = dfs(root, 0)
    if result⁅0⁆ > result⁅1⁆ {
        return result⁅0⁆
    }
    return result⁅1⁆
}

class Solution {
    micro rob(self, root: ArrayList<i64>): i64 {
        return rob(root)
    }
}
