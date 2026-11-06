namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 花期记录 `Flower` 按起点升序排序；结束日另取一份 `ArrayList<i64>` 单参排序。
# 两次排序都依赖 `Comparable` 合同的单参入口，不传比较器；查询用二分，不依赖有序容器查询 API。
structure Flower {
    start: i64
    end: i64
}

# [提案] `std.operator::Comparable` 尚不存在（今日只有 `Equal` / `Identical` / `Ordinal` / `Cardinal`）。
imply Flower: std::operator::Comparable {
    infix `<`(self, other: Flower): bool {
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
