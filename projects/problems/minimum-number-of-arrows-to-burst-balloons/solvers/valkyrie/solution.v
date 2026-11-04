namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 气球区间记录按终点升序排序，直接比较 `Balloon` 结构体。
structure Balloon {
    start: i64
    end: i64
}

# [提案] 顺序合同缺失：终点升序、同终点起点升序。
imply Balloon: std::operator::Comparable {
    infix `<`(self, other: Balloon): bool {
        if self.end != other.end {
            return self.end < other.end
        }
        return self.start < other.start
    }
}

# [提案] 单参排序依赖 `Comparable`；`sort.v` 现无此入口。
micro order_items<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable
{
    sort(items)
}

class Solution {
    [export(case: "findMinArrowShots")]
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
