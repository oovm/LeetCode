namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 球员记录 `Player` 按「分数升序、同分数年龄升序」排序；
# DP 只允许年龄不降的接续，顺序完全由结构体自身声明。
structure Player {
    score: i64
    age: i64
}

# `Comparable: Equal` 是硬性前置：超 trait 的 evidence 是 fail-closed，不自动派生。
imply Player: std::operator::Equal {
    infix `==`(self, other: Player): bool {
        if self.score != other.score {
            return false
        }
        return self.age == other.age
    }

    infix `!=`(self, other: Player): bool {
        return !(self == other)
    }
}

# 顺序合同：分数升序、同分数年龄升序。
imply Player: std::operator::Comparable {
    micro compare(self, other: Self): Ordering {
        if self.score < other.score {
            return Less
        }
        if other.score < self.score {
            return Greater
        }
        if self.age < other.age {
            return Less
        }
        if other.age < self.age {
            return Greater
        }
        return Equal
    }
}

# `sort<T>(list) where T: Comparable` 已按类型合同派生比较器，单参入口直接取序。
micro order_items<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable
{
    sort(items)
}

class Solution {
    [export(case: "camelCase")]
    micro bestTeamScore(scores: [i64], ages: [i64]) -> i64 {
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
