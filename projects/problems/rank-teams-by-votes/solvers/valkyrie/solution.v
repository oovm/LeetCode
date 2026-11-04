namespace leetcode.solution

using std.collection
using std.text

# 题内触发点: G26 —— 名次向量 `Team` 是自定义记录，排序直接依赖类型的序关系，不传比较器。
# 序：第 1 名票数降序、第 2 名票数降序、……、最后按字母升序。
structure Team {
    letter: u8
    ranks: ArrayList<i64>
}

# [提案] `std.operator::Comparable` 尚不存在（今日只有 `Equal` / `Identical` / `Ordinal` / `Cardinal`）。
imply Team: std::operator::Comparable {
    infix `<`(self, other: Team): bool {
        let mut index: usize = 0
        while index < self.ranks.length() {
            if self.ranks⁅index⁆ != other.ranks⁅index⁆ {
                return self.ranks⁅index⁆ > other.ranks⁅index⁆
            }
            index = index + 1
        }
        return self.letter < other.letter
    }
}

# [提案] 按 `Comparable` 合同的单参排序；现有 `sort.v` 的 7 个入口全部要求显式 `cmp`。
micro order_items<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable
{
    merge_sort(items)
}

class Solution {
    [export(case: "rankTeams")]
    micro rankTeams(votes: ArrayList<utf8>) -> utf8 {
        let first: utf8 = votes⁅0⁆
        let width: usize = first.byte_length()

        # 票面保证每张票是同一批队名的排列，故 `votes[0]` 恰好给出全部队伍。
        let mut letters: ArrayList<u8> = ArrayList::new(width)
        let mut ranks: ArrayList<ArrayList<i64>> = ArrayList::new(width)
        let mut slot_of: ArrayList<i64> = ArrayList::new(128)
        let mut code: usize = 0
        while code < 128 {
            slot_of.push(0 - 1)
            code = code + 1
        }

        let mut position: usize = 0
        while position < width {
            let letter: u8 = first.byte_at(position)
            slot_of⁅letter as usize⁆ = position as i64
            letters.push(letter)
            let mut row: ArrayList<i64> = ArrayList::new(width)
            let mut fill: usize = 0
            while fill < width {
                row.push(0)
                fill = fill + 1
            }
            ranks.push(row)
            position = position + 1
        }

        loop vote in votes {
            let mut seat: usize = 0
            while seat < width {
                let letter: u8 = vote.byte_at(seat)
                let team: usize = slot_of⁅letter as usize⁆ as usize
                let row: ArrayList<i64> = ranks⁅team⁆
                row⁅seat⁆ = row⁅seat⁆ + 1
                seat = seat + 1
            }
        }

        let mut teams: ArrayList<Team> = ArrayList::new(width)
        let mut index: usize = 0
        while index < width {
            teams.push(Team { letter: letters⁅index⁆, ranks: ranks⁅index⁆ })
            index = index + 1
        }
        order_items(teams)

        let mut builder: Utf8Builder = Utf8Builder::new(teams.length())
        loop team in teams {
            builder.append(char::from(team.letter as u32))
        }
        return builder.build()
    }
}
