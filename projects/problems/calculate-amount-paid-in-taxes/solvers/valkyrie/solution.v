namespace leetcode.calculate_amount_paid_in_taxes;

using std.collection;

# 分段累进：逐档取 `min(income, upper) - prev` 计税；税额按百分数折算为浮点。
# 题内触发点: calculateTax 返回 `f64`（`tax / 100` 含非整分），归 G2 / G3 面。
[export(case: "camelCase")]
micro calculateTax(brackets: ArrayList<ArrayList<i64>>, income: i64) -> f64 {
    let mut tax: i64 = 0
    let mut prev: i64 = 0
    let mut index: usize = 0
    while index < brackets.length() {
        let upper: i64 = brackets⁅index⁆⁅0⁆
        let percent: i64 = brackets⁅index⁆⁅1⁆
        if income <= prev {
            return (tax as f64) / 100.0
        }
        let capped: i64 = income
        if upper < income {
            capped = upper
        }
        tax = tax + (capped - prev) * percent
        prev = upper
        index = index + 1
    }
    return (tax as f64) / 100.0
}

class Solution {
    micro calculateTax(self, brackets: ArrayList<ArrayList<i64>>, income: i64): f64 {
        return calculateTax(brackets, income)
    }
}
