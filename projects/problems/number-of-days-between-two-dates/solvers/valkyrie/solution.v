namespace leetcode.number_of_days_between_two_dates;

micro is_leap_year(year: i64) -> bool {
    return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)
}

micro days_in_month(year: i64, month: i64) -> i64 {
    if month == 2 {
        if is_leap_year(year) {
            return 29
        }
        return 28
    }
    if month == 4 || month == 6 || month == 9 || month == 11 {
        return 30
    }
    return 31
}

micro two_digits(s: utf8, at: usize) -> i64 {
    let hi: i64 = s⁅at⁆ as u32 as i64 - 48
    let lo: i64 = s⁅at + 1⁆ as u32 as i64 - 48
    return hi * 10 + lo
}

micro calc_days(date: utf8) -> i64 {
    let year: i64 = two_digits(date, 0) * 100 + two_digits(date, 2)
    let month: i64 = two_digits(date, 5)
    let day: i64 = two_digits(date, 8)
    let mut days: i64 = 0
    let mut y: i64 = 1971
    while y < year {
        days = days + 365
        if is_leap_year(y) {
            days = days + 1
        }
        y = y + 1
    }
    let mut m: i64 = 1
    while m < month {
        days = days + days_in_month(year, m)
        m = m + 1
    }
    return days + day
}

[export(case: "camelCase")]
micro days_between_dates(date1: utf8, date2: utf8) -> i64 {
    let d1: i64 = calc_days(date1)
    let d2: i64 = calc_days(date2)
    if d1 > d2 {
        return d1 - d2
    }
    return d2 - d1
}

class Solution {
    micro daysBetweenDates(self, date1: utf8, date2: utf8): i64 {
        return days_between_dates(date1, date2)
    }
}
