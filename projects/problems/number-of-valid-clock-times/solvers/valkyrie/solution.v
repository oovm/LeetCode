namespace leetcode.number_of_valid_clock_times;

[export(case: "camelCase")]
micro count_time(time: utf8) -> i64 {
    let n: usize = time.length()
    if n < 5 {
        return 0
    }
    if time⁅2⁆ as u32 != 58 {
        return 0
    }
    let h0: u32 = time⁅0⁆ as u32
    let h1: u32 = time⁅1⁆ as u32
    let m0: u32 = time⁅3⁆ as u32
    let m1: u32 = time⁅4⁆ as u32
    let mut hours: i64 = 0
    let mut h: i64 = 0
    while h < 24 {
        let ht: u32 = (48 + h / 10) as u32
        let ho: u32 = (48 + h % 10) as u32
        if (h0 == 63 || h0 == ht) && (h1 == 63 || h1 == ho) {
            hours = hours + 1
        }
        h = h + 1
    }
    let mut minutes: i64 = 0
    let mut m: i64 = 0
    while m < 60 {
        let mt: u32 = (48 + m / 10) as u32
        let mo: u32 = (48 + m % 10) as u32
        if (m0 == 63 || m0 == mt) && (m1 == 63 || m1 == mo) {
            minutes = minutes + 1
        }
        m = m + 1
    }
    return hours * minutes
}

class Solution {
    micro countTime(self, time: utf8): i64 {
        return count_time(time)
    }
}
