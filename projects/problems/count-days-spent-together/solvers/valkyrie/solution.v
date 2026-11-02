namespace leetcode.count_days_spent_together;

micro two_digits_of(s: utf8, at: usize) -> i64 {
    let hi: i64 = s⁅at⁆ as u32 as i64 - 48
    let lo: i64 = s⁅at + 1⁆ as u32 as i64 - 48
    return hi * 10 + lo
}

micro days_in(month: i64) -> i64 {
    if month == 2 {
        return 28
    }
    if month == 4 || month == 6 || month == 9 || month == 11 {
        return 30
    }
    return 31
}

micro to_day_of_year(date: utf8) -> i64 {
    let month: i64 = two_digits_of(date, 0)
    let day: i64 = two_digits_of(date, 3)
    let mut total: i64 = 0
    let mut m: i64 = 1
    while m < month {
        total = total + days_in(m)
        m = m + 1
    }
    return total + day
}

micro max_i64(a: i64, b: i64) -> i64 {
    if a > b {
        return a
    }
    return b
}

micro min_i64(a: i64, b: i64) -> i64 {
    if a < b {
        return a
    }
    return b
}

[export(case: "camelCase")]
micro count_days_together(arriveAlice: utf8, leaveAlice: utf8, arriveBob: utf8, leaveBob: utf8) -> i64 {
    let start: i64 = max_i64(to_day_of_year(arriveAlice), to_day_of_year(arriveBob))
    let stop: i64 = min_i64(to_day_of_year(leaveAlice), to_day_of_year(leaveBob))
    let days: i64 = stop - start + 1
    if days < 0 {
        return 0
    }
    return days
}

class Solution {
    micro countDaysTogether(self, arriveAlice: utf8, leaveAlice: utf8, arriveBob: utf8, leaveBob: utf8): i64 {
        return count_days_together(arriveAlice, leaveAlice, arriveBob, leaveBob)
    }
}
