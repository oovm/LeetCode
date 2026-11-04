namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 直接对自定义记录 `Interval` 排序，不写内联 `micro(a, b) -> i32` 比较器。
# 理想形态是类型系统提供序关系合同，排序入口按合同取序，而不是把比较逻辑塞进题解。
structure Interval {
    start: i64
    end: i64
}

# [提案] `std.operator::Comparable` 尚不存在（今日只有 `Equal` / `Identical` / `Ordinal` / `Cardinal`）。
# 本块写出「自定义类型声明自己的序」的理想形态：起升序、同起终点升序。
imply Interval: std::operator::Comparable {
    infix `<`(self, other: Interval): bool {
        if self.start != other.start {
            return self.start < other.start
        }
        return self.end < other.end
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
    [export(case: "merge")]
    micro merge(intervals: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
        let mut rows: ArrayList<Interval> = ArrayList::new(intervals.length())
        loop row in intervals {
            rows.push(Interval { start: row⁅0⁆, end: row⁅1⁆ })
        }
        order_items(rows)

        let mut merged: ArrayList<ArrayList<i64>> = ArrayList::new(rows.length())
        if rows.length() == 0 {
            return merged
        }

        let mut current: Interval = rows⁅0⁆
        let mut index: usize = 1
        while index < rows.length() {
            let next: Interval = rows⁅index⁆
            if next.start <= current.end {
                if next.end > current.end {
                    current = Interval { start: current.start, end: next.end }
                }
            } else {
                let mut pair: ArrayList<i64> = ArrayList::new(2)
                pair.push(current.start)
                pair.push(current.end)
                merged.push(pair)
                current = next
            }
            index = index + 1
        }

        let mut tail: ArrayList<i64> = ArrayList::new(2)
        tail.push(current.start)
        tail.push(current.end)
        merged.push(tail)
        return merged
    }
}
