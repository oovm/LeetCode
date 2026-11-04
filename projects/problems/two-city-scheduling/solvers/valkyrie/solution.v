namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 人员成本记录 `CostRow` 按「去 A 城相对去 B 城的差价」升序排序。
# 差价相同的记录依赖排序稳定性保持原始次序，题解不额外传比较器。
structure CostRow {
    city_a: i64
    city_b: i64
}

# [提案] 顺序合同缺失：差价升序、再按两城成本兜底。
imply CostRow: std::operator::Comparable {
    infix `<`(self, other: CostRow): bool {
        let self_gap: i64 = self.city_a - self.city_b
        let other_gap: i64 = other.city_a - other.city_b
        if self_gap != other_gap {
            return self_gap < other_gap
        }
        if self.city_a != other.city_a {
            return self.city_a < other.city_a
        }
        return self.city_b < other.city_b
    }
}

# [提案] 单参排序依赖 `Comparable`；`sort.v` 现无此入口。
micro order_items<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable
{
    merge_sort(items)
}

class Solution {
    [export(case: "twoCitySchedCost")]
    micro twoCitySchedCost(costs: ArrayList<ArrayList<i64>>) -> i64 {
        let mut rows: ArrayList<CostRow> = ArrayList::new(costs.length())
        loop row in costs {
            rows.push(CostRow { city_a: row⁅0⁆, city_b: row⁅1⁆ })
        }
        order_items(rows)

        let half: usize = rows.length() / 2
        let mut total: i64 = 0
        let mut index: usize = 0
        while index < rows.length() {
            let row: CostRow = rows⁅index⁆
            if index < half {
                total = total + row.city_a
            } else {
                total = total + row.city_b
            }
            index = index + 1
        }
        return total
    }
}
