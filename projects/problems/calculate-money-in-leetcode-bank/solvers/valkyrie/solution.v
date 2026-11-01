namespace leetcode.calculate_money_in_leetcode_bank;

[export(case: "camelCase")]
micro total_money(n: i64) -> i64 {
    let mut total: i64 = 0
    let mut day: i64 = 0
    while day < n {
        let week: i64 = day / 7
        let weekday: i64 = day % 7
        total = total + week + weekday + 1
        day = day + 1
    }
    return total
}

class Solution {
    micro totalMoney(self, n: i64): i64 {
        return total_money(n)
    }
}
