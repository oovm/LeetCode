namespace leetcode.binary_watch;

micro bit_count(x: i64) -> i64 {
    let mut v: i64 = x
    let mut count: i64 = 0
    while v > 0 {
        count = count + v % 2
        v = v / 2
    }
    return count
}

# 枚举 12 小时 x 60 分钟，点亮数等于 turnedOn 即合法。
[export(case: "camelCase")]
micro read_binary_watch(turnedOn: i64) -> [utf8] {
    let mut result: ArrayList<utf8> = ArrayList::new(0)
    let mut hour: i64 = 0
    while hour < 12 {
        let mut minute: i64 = 0
        while minute < 60 {
            if bit_count(hour) + bit_count(minute) == turnedOn {
                let mut builder: Utf8Builder = Utf8Builder::new(8)
                builder.append_i64(hour)
                builder.append(char::from(58 as u32))
                if minute < 10 {
                    builder.append(char::from(48 as u32))
                }
                builder.append_i64(minute)
                result.push(builder.build())
            }
            minute = minute + 1
        }
        hour = hour + 1
    }
    return result.to_array()
}

class Solution {
    micro readBinaryWatch(self, turnedOn: i64): [utf8] {
        return read_binary_watch(turnedOn)
    }
}
