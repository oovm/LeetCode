namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 事件记录 `Event` 按开始日升序（同日按结束日、价值兜底）排序；
# 排序只依赖 `Comparable` 合同的单参入口，DP 内的「下一个可参加事件」用二分，不用有序容器查询 API。
structure Event {
    start: i64
    end: i64
    value: i64
}

# `Comparable: Equal` 是硬性前置：超 trait 的 evidence 是 fail-closed，不自动派生。
imply Event: std::operator::Equal {
    infix `==`(self, other: Event): bool {
        if self.start != other.start {
            return false
        }
        if self.end != other.end {
            return false
        }
        return self.value == other.value
    }

    infix `!=`(self, other: Event): bool {
        return !(self == other)
    }
}

# 顺序合同：开始日升序、同日结束日升序、再按价值升序。
imply Event: std::operator::Comparable {
    micro compare(self, other: Self): Ordering {
        if self.start < other.start {
            return Less
        }
        if other.start < self.start {
            return Greater
        }
        if self.end < other.end {
            return Less
        }
        if other.end < self.end {
            return Greater
        }
        if self.value < other.value {
            return Less
        }
        if other.value < self.value {
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

# 首个开始日 > value 的下标；事件按开始日升序，故它就是「结束 value 之后能参加的第一场」。
micro first_start_after(starts: ArrayList<i64>, value: i64) -> usize {
    let mut low: usize = 0
    let mut high: usize = starts.length()
    while low < high {
        let middle: usize = low + (high - low) / 2
        if starts⁅middle⁆ <= value {
            low = middle + 1
        } else {
            high = middle
        }
    }
    return low
}

class Solution {
    [export(case: "camelCase")]
    micro maxValue(events: ArrayList<ArrayList<i64>>, k: i64) -> i64 {
        let mut rows: ArrayList<Event> = ArrayList::new(events.length())
        loop row in events {
            rows.push(Event { start: row⁅0⁆, end: row⁅1⁆, value: row⁅2⁆ })
        }
        order_items(rows)

        let mut starts: ArrayList<i64> = ArrayList::new(rows.length())
        loop row in rows {
            starts.push(row.start)
        }

        let size: usize = rows.length() + 1
        let mut previous: ArrayList<i64> = ArrayList::new(size)
        let mut fill: usize = 0
        while fill < size {
            previous.push(0)
            fill = fill + 1
        }

        let mut round: i64 = 0
        while round < k {
            let mut current: ArrayList<i64> = ArrayList::new(size)
            let mut fill_current: usize = 0
            while fill_current < size {
                current.push(0)
                fill_current = fill_current + 1
            }

            let mut index: usize = rows.length()
            while index > 0 {
                index = index - 1
                let event: Event = rows⁅index⁆
                let next: usize = first_start_after(starts, event.end)
                let skip: i64 = current⁅index + 1⁆
                let take: i64 = event.value + previous⁅next⁆
                if take > skip {
                    current⁅index⁆ = take
                } else {
                    current⁅index⁆ = skip
                }
            }
            previous = current
            round = round + 1
        }
        return previous⁅0⁆
    }
}
