namespace leetcode.day_of_the_week;

# 严格构造：下述字面量均为 ASCII，`from_bytes` 不会失败；Fail 分支保持类型完备。
micro text_of(bytes: [u8]) -> utf8 {
    match Utf8Text::from_bytes(bytes) {
        case Fine(text):
            return text
        case Fail(_):
            return Utf8Builder::new(0).build()
    }
}

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
    # 基准日是 1971-01-01（Friday）。年份可早于或晚于基准年，按方向累加整年天数。
    let mut y: i64 = 1971
    if year >= 1971 {
        while y < year {
            if is_leap(y) {
                days = days + 366
            } else {
                days = days + 365
            }
            y = y + 1
        }
    } else {
        while y > year {
            y = y - 1
            if is_leap(y) {
                days = days - 366
            } else {
                days = days - 365
            }
        }
    }
    let mut m: i64 = 1
    while m < month {
        days = days + month_days(m, year)
        m = m + 1
    }
    days = days + day - 1
    let mut dow: i64 = (days + 5) % 7
    if dow < 0 {
        dow = dow + 7
    }
    if dow == 0 {
        return text_of([83, 117, 110, 100, 97, 121])
    }
    if dow == 1 {
        return text_of([77, 111, 110, 100, 97, 121])
    }
    if dow == 2 {
        return text_of([84, 117, 101, 115, 100, 97, 121])
    }
    if dow == 3 {
        return text_of([87, 101, 100, 110, 101, 115, 100, 97, 121])
    }
    if dow == 4 {
        return text_of([84, 104, 117, 114, 115, 100, 97, 121])
    }
    if dow == 5 {
        return text_of([70, 114, 105, 100, 97, 121])
    }
    return text_of([83, 97, 116, 117, 114, 100, 97, 121])
}

class Solution {
    micro dayOfTheWeek(self, day: i64, month: i64, year: i64): utf8 {
        return day_of_the_week(day, month, year)
    }
}
