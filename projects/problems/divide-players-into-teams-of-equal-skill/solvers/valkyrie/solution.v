namespace leetcode.divide_players_into_teams_of_equal_skill;

using std.collection;

# 排序后首尾配对，每对技能和必须相同。
# 若总和不能被队伍数整除，或某一对不满足目标和，返回 -1。
[export(case: "camelCase")]
micro dividePlayers(skill: [i64]) -> i64 {
    let mut values: ArrayList<i64> = ArrayList::new(skill.length())
    let mut total: i64 = 0
    loop value in skill {
        values.push(value)
        total = total + value
    }
    sort(values)

    let teams: i64 = skill.length() as i64 / 2
    if total % teams != 0 {
        return -1
    }
    let target: i64 = total / teams

    let mut left: usize = 0
    let mut right: usize = values.length() - 1
    let mut chemistry: i64 = 0
    while left < right {
        if values⁅left⁆ + values⁅right⁆ != target {
            return -1
        }
        chemistry = chemistry + values⁅left⁆ * values⁅right⁆
        left = left + 1
        right = right - 1
    }
    return chemistry
}

class Solution {
    micro dividePlayers(self, skill: [i64]): i64 {
        return dividePlayers(skill)
    }
}
