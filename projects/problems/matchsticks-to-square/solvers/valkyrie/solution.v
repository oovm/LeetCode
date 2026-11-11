namespace leetcode.matchsticks_to_square;

using std.collection;

# 降序 DFS 装边：先放长边剪枝快；四条边容量相同，放满即成功。
micro dfs_desc(sticks: ArrayList<i64>, index: usize, sides: ArrayList<i64>, target: i64) -> bool {
    if index == sticks.length() {
        return sides⁅0⁆ == target && sides⁅1⁆ == target && sides⁅2⁆ == target && sides⁅3⁆ == target
    }
    let value: i64 = sticks⁅sticks.length() - 1 - index⁆
    let mut side: usize = 0
    while side < 4 {
        if sides⁅side⁆ + value <= target {
            let mut duplicate: bool = false
            let mut other: usize = 0
            while other < side {
                if sides⁅other⁆ == sides⁅side⁆ {
                    duplicate = true
                }
                other = other + 1
            }
            if !duplicate {
                sides⁅side⁆ = sides⁅side⁆ + value
                if dfs_desc(sticks, index + 1, sides, target) {
                    return true
                }
                sides⁅side⁆ = sides⁅side⁆ - value
            }
        }
        side = side + 1
    }
    return false
}

[export(case: "camelCase")]
micro makesquare(matchsticks: ArrayList<i64>) -> bool {
    let mut total: i64 = 0
    loop value in matchsticks {
        total = total + value
    }
    if total % 4 != 0 {
        return false
    }
    let mut sorted: ArrayList<i64> = ArrayList::new(matchsticks.length())
    loop value in matchsticks {
        sorted.push(value)
    }
    sort(sorted)
    let mut sides: ArrayList<i64> = ArrayList::new(4)
    let mut slot: usize = 0
    while slot < 4 {
        sides.push(0)
        slot = slot + 1
    }
    return dfs_desc(sorted, 0, sides, total / 4)
}

class Solution {
    micro makesquare(self, matchsticks: ArrayList<i64>): bool {
        return makesquare(matchsticks)
    }
}
