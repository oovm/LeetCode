namespace leetcode.minimum_amount_of_time_to_fill_cups;

using std.collection;

# 排序后贪心：每分钟尽量填两杯不同的杯子。
# 最少两杯之和不超过最多一杯时，答案等于最多一杯；
# 否则总耗时是总数的一半向上取整。
[export(case: "camelCase")]
micro fillCups(amount: [i64]) -> i64 {
    let mut cups: ArrayList<i64> = ArrayList::new(amount.length())
    loop cup in amount {
        cups.push(cup)
    }
    sort(cups)

    let first: i64 = cups⁅0⁆
    let second: i64 = cups⁅1⁆
    let third: i64 = cups⁅2⁆
    if first + second <= third {
        return third
    }
    return (first + second + third + 1) / 2
}

class Solution {
    micro fillCups(self, amount: [i64]): i64 {
        return fillCups(amount)
    }
}
