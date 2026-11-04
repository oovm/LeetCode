namespace leetcode.minimum_cost_of_buying_candies_with_discount

# 降序后每第 3 个（下标 2、5、8...）免费；用值域有界的计数表完成降序遍历。
[export(case: "camelCase")]
micro minimumCost(cost: ArrayList<i64>) -> i64 {
    let count: usize = cost.length()
    let zero: usize = 0
    let mut low: i64 = cost⁅zero⁆
    let mut high: i64 = cost⁅zero⁆
    let mut i: usize = 1
    while i < count {
        let value: i64 = cost⁅i⁆
        if value < low {
            low = value
        }
        if value > high {
            high = value
        }
        i = i + 1
    }

    let span: usize = (high - low + 1) as usize
    let mut buckets: ArrayList<i64> = ArrayList::new(span)
    let mut slot: usize = 0
    while slot < span {
        buckets.push(0)
        slot = slot + 1
    }

    let mut j: usize = 0
    while j < count {
        let offset: usize = (cost⁅j⁆ - low) as usize
        buckets⁅offset⁆ = buckets⁅offset⁆ + 1
        j = j + 1
    }

    let mut total: i64 = 0
    let mut taken: i64 = 0
    let mut step: usize = 0
    while step < span {
        let offset: usize = span - 1 - step
        let value: i64 = low + offset as i64
        let mut repeat: i64 = buckets⁅offset⁆
        while repeat > 0 {
            if taken % 3 != 2 {
                total = total + value
            }
            taken = taken + 1
            repeat = repeat - 1
        }
        step = step + 1
    }
    return total
}

class Solution {
    micro minimumCost(self, cost: ArrayList<i64>): i64 {
        return minimumCost(cost)
    }
}
