namespace leetcode.day_of_the_year;

micro is_leap(y: i64) -> bool {
    if y % 400 == 0 {
        return true
    }
    if y % 100 == 0 {
        return false
    }
    return y % 4 == 0
}

micro month_days(m: i64, y: i64) -> i64 {
    if m == 2 {
        if is_leap(y) {
            return 29
        }
        return 28
    }
    if m == 4 || m == 6 || m == 9 || m == 11 {
        return 30
    }
    return 31
}

micro digit_at(s: utf8, i: usize) -> i64 {
    return (s⁅i⁆ as u32 - 48) as i64
}

[export(case: "camelCase")]
micro day_of_year(date: utf8) -> i64 {
    let year: i64 = digit_at(date, 0) * 1000 + digit_at(date, 1) * 100 + digit_at(date, 2) * 10 + digit_at(date, 3)
    let month: i64 = digit_at(date, 5) * 10 + digit_at(date, 6)
    let day: i64 = digit_at(date, 8) * 10 + digit_at(date, 9)
    let mut total: i64 = day
    let mut m: i64 = 1
    while m < month {
        total = total + month_days(m, year)
        m = m + 1
    }
    return total
}

class Solution {
    micro dayOfYear(self, date: utf8): i64 {
        return day_of_year(date)
    }
}
