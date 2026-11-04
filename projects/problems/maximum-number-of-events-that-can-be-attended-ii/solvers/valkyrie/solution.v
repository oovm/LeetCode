namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 事件记录 `Event` 按开始日升序（同日按结束日、价值兜底）排序；
# 排序只依赖 `Comparable` 合同的单参入口，DP 内的「下一个可参加事件」用二分，不用有序容器查询 API。
structure Event {
    start: i64
    end: i64
    value: i64
}

# [提案] `std.operator::Comparable` 尚不存在（今日只有 `Equal` / `Identical` / `Ordinal` / `Cardinal`）。
imply Event: std::operator::Comparable {
    infix `<`(self, other: Event): bool {
        if self.start != other.start {
            return self.start < other.start
        }
        if self.end != other.end {
            return self.end < other.end
        }
        return self.value < other.value
    }
}

# [提案] 按 `Comparable` 合同的单参排序；现有 `sort.v` 的 7 个入口全部要求显式 `cmp`。
micro order_items<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable
{
    merge_sort(items)
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
    [export(case: "maxValue")]
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
