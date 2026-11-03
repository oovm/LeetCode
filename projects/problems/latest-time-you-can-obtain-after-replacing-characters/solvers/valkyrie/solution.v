namespace leetcode.latest_time_you_can_obtain_after_replacing_characters;

# 12 小时制下按位贪心：时取最大合法值，分取最大。
[export(case: "camelCase")]
micro find_latest_time(s: utf8) -> utf8 {
    let zero: usize = 0
    let one: usize = 1
    let three: usize = 3
    let four: usize = 4
    let mut hour_high: u32 = s⁅zero⁆ as u32
    let mut hour_low: u32 = s⁅one⁆ as u32
    let mut minute_high: u32 = s⁅three⁆ as u32
    let mut minute_low: u32 = s⁅four⁆ as u32
    if hour_high == 63 {
        if hour_low == 63 || hour_low == 48 || hour_low == 49 {
            hour_high = 49
        } else {
            hour_high = 48
        }
    }
    if hour_low == 63 {
        if hour_high == 48 {
            hour_low = 57
        } else {
            hour_low = 49
        }
    }
    if minute_high == 63 {
        minute_high = 53
    }
    if minute_low == 63 {
        minute_low = 57
    }
    let mut builder: Utf8Builder = Utf8Builder::new(5)
    builder.append(char::from(hour_high))
    builder.append(char::from(hour_low))
    builder.append(char::from(58))
    builder.append(char::from(minute_high))
    builder.append(char::from(minute_low))
    return builder.build()
}

class Solution {
    micro findLatestTime(self, s: utf8): utf8 {
        return find_latest_time(s)
    }
}
