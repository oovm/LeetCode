namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 球员记录 `Player` 按「分数升序、同分数年龄升序」排序；
# DP 只允许年龄不降的接续，顺序完全由结构体自身声明。
structure Player {
    score: i64
    age: i64
}

# [提案] 顺序合同缺失：分数升序、同分数年龄升序。
imply Player: std::operator::Comparable {
    infix `<`(self, other: Player): bool {
        if self.score != other.score {
            return self.score < other.score
        }
        return self.age < other.age
    }
}

# [提案] 单参排序依赖 `Comparable`；`sort.v` 现无此入口。
micro order_items<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable
{
    merge_sort(items)
}

class Solution {
    [export(case: "bestTeamScore")]
    micro bestTeamScore(scores: ArrayList<i64>, ages: ArrayList<i64>) -> i64 {
        let count: usize = scores.length()
        if count == 0 {
            return 0
        }

        let mut rows: ArrayList<Player> = ArrayList::new(count)
        let mut cursor: usize = 0
        while cursor < count {
            rows.push(Player { score: scores⁅cursor⁆, age: ages⁅cursor⁆ })
            cursor = cursor + 1
        }
        order_items(rows)

        let mut dp: ArrayList<i64> = ArrayList::new(count)
        let mut best: i64 = 0
        let mut index: usize = 0
        while index < count {
            let player: Player = rows⁅index⁆
            let mut total: i64 = player.score

            let mut previous: usize = 0
            while previous < index {
                let candidate: Player = rows⁅previous⁆
                if candidate.age <= player.age {
                    let through: i64 = dp⁅previous⁆ + player.score
                    if through > total {
                        total = through
                    }
                }
                previous = previous + 1
            }

            dp.push(total)
            if total > best {
                best = total
            }
            index = index + 1
        }
        return best
    }
}
