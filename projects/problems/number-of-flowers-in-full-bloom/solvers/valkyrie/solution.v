namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 花期记录 `Flower` 按起点升序排序；结束日另取一份 `ArrayList<i64>` 单参排序。
# 两次排序都依赖 `Comparable` 合同的单参入口，不传比较器；查询用二分，不依赖有序容器查询 API。
structure Flower {
    start: i64
    end: i64
}

# `Comparable: Equal` 是硬性前置：超 trait 的 evidence 是 fail-closed，不自动派生。
imply Flower: std::operator::Equal {
    infix `==`(self, other: Flower): bool {
        if self.start != other.start {
            return false
        }
        return self.end == other.end
    }

    infix `!=`(self, other: Flower): bool {
        return !(self == other)
    }
}

# 顺序合同：起点升序、同起点结束日升序。
imply Flower: std::operator::Comparable {
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
        return Equal
    }
}

# `sort<T>(list) where T: Comparable` 已按类型合同派生比较器，单参入口直接取序。
micro order_items<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable
{
    sort(items)
}

# 首个起点 > value 的下标，即起点 <= value 的花的数量。
micro count_opened(flowers: ArrayList<Flower>, value: i64) -> usize {
    let mut low: usize = 0
    let mut high: usize = flowers.length()
    while low < high {
        let middle: usize = low + (high - low) / 2
        if flowers⁅middle⁆.start <= value {
            low = middle + 1
        } else {
            high = middle
        }
    }
    return low
}

# 首个结束日 >= value 的下标，即已经凋谢（结束日 < value）的花的数量。
micro count_closed(ends: ArrayList<i64>, value: i64) -> usize {
    let mut low: usize = 0
    let mut high: usize = ends.length()
    while low < high {
        let middle: usize = low + (high - low) / 2
        if ends⁅middle⁆ < value {
            low = middle + 1
        } else {
            high = middle
        }
    }
    return low
}

class Solution {
    [export(case: "camelCase")]
    micro fullBloomFlowers(flowers: ArrayList<ArrayList<i64>>, people: ArrayList<i64>) -> ArrayList<i64> {
        let mut periods: ArrayList<Flower> = ArrayList::new(flowers.length())
        let mut ends: ArrayList<i64> = ArrayList::new(flowers.length())
        loop flower in flowers {
            periods.push(Flower { start: flower⁅0⁆, end: flower⁅1⁆ })
            ends.push(flower⁅1⁆)
        }
        order_items(periods)
        order_items(ends)

        let mut answers: ArrayList<i64> = ArrayList::new(people.length())
        loop person in people {
            let opened: usize = count_opened(periods, person)
            let closed: usize = count_closed(ends, person)
            answers.push((opened - closed) as i64)
        }
        return answers
    }
}
