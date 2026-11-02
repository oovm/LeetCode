namespace leetcode.number_of_days_in_a_month;

micro is_leap_year(year: i64) -> bool {
    if year % 400 == 0 {
        return true
    }
    if year % 100 == 0 {
        return false
    }
    if year % 4 == 0 {
        return true
    }
    return false
}

[export(case: "camelCase")]
micro number_of_days(year: i64, month: i64) -> i64 {
    if month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12 {
        return 31
    }
    if month == 4 || month == 6 || month == 9 || month == 11 {
        return 30
    }
    if is_leap_year(year) {
        return 29
    }
    return 28
}

class Solution {
    micro numberOfDays(self, year: i64, month: i64): i64 {
        return number_of_days(year, month)
    }
}
