namespace leetcode.largest_time_for_given_digits;

using std.collection;

micro two_digits(value: i64) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(2)
    builder.append(char::from((48 + value / 10) as u32))
    builder.append(char::from((48 + value % 10) as u32))
    return builder.build()
}

# 时间只有 24 * 60 种，从最大合法时刻往下枚举，首个频次匹配即为答案。
# 代价 O(1440 * 10)，与输入规模无关。
[export(case: "camelCase")]
micro largest_time_from_digits(arr: ArrayList<i64>) -> utf8 {
    let mut counts: ArrayList<i64> = ArrayList::new(10)
    let mut fill: usize = 0
    while fill < 10 {
        counts.push(0)
        fill = fill + 1
    }
    let mut index: usize = 0
    while index < arr.length() {
        counts⁅arr⁅index⁆ as usize⁆ = counts⁅arr⁅index⁆ as usize⁆ + 1
        index = index + 1
    }
    let mut hour: i64 = 23
    while hour >= 0 {
        let mut minute: i64 = 59
        while minute >= 0 {
            let mut trial: ArrayList<i64> = ArrayList::new(10)
            let mut slot: usize = 0
            while slot < 10 {
                trial.push(0)
                slot = slot + 1
            }
            trial⁅(hour / 10) as usize⁆ = trial⁅(hour / 10) as usize⁆ + 1
            trial⁅(hour % 10) as usize⁆ = trial⁅(hour % 10) as usize⁆ + 1
            trial⁅(minute / 10) as usize⁆ = trial⁅(minute / 10) as usize⁆ + 1
            trial⁅(minute % 10) as usize⁆ = trial⁅(minute % 10) as usize⁆ + 1
            let mut same: bool = true
            let mut digit: usize = 0
            while digit < 10 {
                if trial⁅digit⁆ != counts⁅digit⁆ {
                    same = false
                    break
                }
                digit = digit + 1
            }
            if same {
                let mut builder: Utf8Builder = Utf8Builder::new(5)
                builder.append(two_digits(hour))
                builder.append(char::from(58))
                builder.append(two_digits(minute))
                return builder.build()
            }
            minute = minute - 1
        }
        hour = hour - 1
    }
    let mut empty: Utf8Builder = Utf8Builder::new(0)
    return empty.build()
}

class Solution {
    micro largestTimeFromDigits(self, arr: ArrayList<i64>): utf8 {
        return largest_time_from_digits(arr)
    }
}
