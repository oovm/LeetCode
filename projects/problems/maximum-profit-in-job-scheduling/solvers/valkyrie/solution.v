namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 三字段作业记录 `Job` 按终点升序排序；DP 的前驱查找也按记录字段比较。
structure Job {
    start: i64
    end: i64
    profit: i64
}

# `Comparable: Equal` 是硬性前置：超 trait 的 evidence 是 fail-closed，不自动派生。
imply Job: std::operator::Equal {
    infix `==`(self, other: Job): bool {
        if self.end != other.end {
            return false
        }
        if self.start != other.start {
            return false
        }
        return self.profit == other.profit
    }

    infix `!=`(self, other: Job): bool {
        return !(self == other)
    }
}

# 顺序合同：终点升序、同终点起点升序、再按收益。
imply Job: std::operator::Comparable {
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
        if self.profit < other.profit {
            return Less
        }
        if other.profit < self.profit {
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
    micro jobScheduling(startTime: ArrayList<i64>, endTime: ArrayList<i64>, profit: ArrayList<i64>) -> i64 {
        let count: usize = startTime.length()
        if count == 0 {
            return 0
        }

        let mut rows: ArrayList<Job> = ArrayList::new(count)
        let mut cursor: usize = 0
        while cursor < count {
            rows.push(Job {
                start: startTime⁅cursor⁆,
                end: endTime⁅cursor⁆,
                profit: profit⁅cursor⁆,
            })
            cursor = cursor + 1
        }
        order_items(rows)

        let mut dp: ArrayList<i64> = ArrayList::new(count + 1)
        dp.push(0)
        let mut index: usize = 1
        while index <= count {
            let job: Job = rows⁅index - 1⁆

            let mut low: usize = 0
            let mut high: usize = index - 1
            while low < high {
                let mid: usize = low + (high - low + 1) / 2
                if rows⁅mid - 1⁆.end <= job.start {
                    low = mid
                } else {
                    high = mid - 1
                }
            }

            let mut take: i64 = job.profit
            if low > 0 {
                take = take + dp⁅low⁆
            }
            let mut best: i64 = dp⁅index - 1⁆
            if take > best {
                best = take
            }
            dp.push(best)
            index = index + 1
        }
        return dp⁅count⁆
    }
}
