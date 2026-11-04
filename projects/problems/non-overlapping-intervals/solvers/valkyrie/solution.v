namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 区间记录按「终点升序、同终点起点升序」的多字段序排序，直接比较 `Interval`。
structure Interval {
    start: i64
    end: i64
}

# [提案] 顺序合同缺失。同起点/同终点区间的先后由结构体自身声明，题解不传比较器。
imply Interval: std::operator::Comparable {
    infix `<`(self, other: Interval): bool {
        if self.end != other.end {
            return self.end < other.end
        }
        return self.start < other.start
    }
}

# 依赖 std C4（待落地 API）：`micro sort<T, C>(list: mut C) where C: Cardinal<Element = T> & Countable, T: Comparable`
# 该入口尚未落地，`sort` / `sorted` 不是现成能力；本处按定稿签名书写，C4 落地前不计通过。
micro order_items<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable
{
    sort(items)
}

class Solution {
    [export(case: "eraseOverlapIntervals")]
    micro eraseOverlapIntervals(intervals: ArrayList<ArrayList<i64>>) -> i64 {
        let mut rows: ArrayList<Interval> = ArrayList::new(intervals.length())
        loop row in intervals {
            rows.push(Interval { start: row⁅0⁆, end: row⁅1⁆ })
        }
        order_items(rows)

        let mut reach: i64 = 0 - 1000000000000000
        let mut kept: i64 = 0
        loop row in rows {
            if row.start >= reach {
                kept = kept + 1
                reach = row.end
            }
        }
        return (rows.length() as i64) - kept
    }
}
