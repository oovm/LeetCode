namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 气球区间记录按终点升序排序，直接比较 `Balloon` 结构体。
structure Balloon {
    start: i64
    end: i64
}

# `Comparable: Equal` 是硬性前置：超 trait 的 evidence 是 fail-closed，不自动派生。
imply Balloon: std::operator::Equal {
    infix `==`(self, other: Balloon): bool {
        if self.end != other.end {
            return false
        }
        return self.start == other.start
    }

    infix `!=`(self, other: Balloon): bool {
        return !(self == other)
    }
}

# 顺序合同：终点升序、同终点起点升序。
imply Balloon: std::operator::Comparable {
    micro compare(self, other: Self): Ordering {
        if self.end < other.end {
            return Less
        }
        if other.end < self.end {
            return Greater
        }
        if self.start < other.start {
            return Less
        }
        if other.start < self.start {
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
    micro findMinArrowShots(points: ArrayList<ArrayList<i64>>) -> i64 {
        let mut rows: ArrayList<Balloon> = ArrayList::new(points.length())
        loop row in points {
            rows.push(Balloon { start: row⁅0⁆, end: row⁅1⁆ })
        }
        order_items(rows)

        let mut reach: i64 = 0 - 1000000000000000
        let mut arrows: i64 = 0
        loop row in rows {
            if row.start > reach {
                arrows = arrows + 1
                reach = row.end
            }
        }
        return arrows
    }
}
