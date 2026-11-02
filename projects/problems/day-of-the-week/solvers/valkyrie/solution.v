namespace leetcode.day_of_the_week;

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

[export(case: "camelCase")]
micro day_of_the_week(day: i64, month: i64, year: i64) -> utf8 {
    let mut days: i64 = 0
    let mut y: i64 = 1971
    while y < year {
        if is_leap(y) {
            days = days + 366
        } else {
            days = days + 365
        }
        y = y + 1
    }
    let mut m: i64 = 1
    while m < month {
        days = days + month_days(m, year)
        m = m + 1
    }
    days = days + day - 1
    let dow: i64 = (days + 5) % 7
    if dow == 0 {
        return Utf8Text::from_bytes([83, 117, 110, 100, 97, 121])
    }
    if dow == 1 {
        return Utf8Text::from_bytes([77, 111, 110, 100, 97, 121])
    }
    if dow == 2 {
        return Utf8Text::from_bytes([84, 117, 101, 115, 100, 97, 121])
    }
    if dow == 3 {
        return Utf8Text::from_bytes([87, 101, 100, 110, 101, 115, 100, 97, 121])
    }
    if dow == 4 {
        return Utf8Text::from_bytes([84, 104, 117, 114, 115, 100, 97, 121])
    }
    if dow == 5 {
        return Utf8Text::from_bytes([70, 114, 105, 100, 97, 121])
    }
    return Utf8Text::from_bytes([83, 97, 116, 117, 114, 100, 97, 121])
}

class Solution {
    micro dayOfTheWeek(self, day: i64, month: i64, year: i64): utf8 {
        return day_of_the_week(day, month, year)
    }
}
