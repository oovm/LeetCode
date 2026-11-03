namespace leetcode.minimum_number_of_chairs_in_a_waiting_room;

# 进出相抵后取在场人数的峰值。
[export(case: "camelCase")]
micro minimum_chairs(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut current: i64 = 0
    let mut peak: i64 = 0
    let mut i: usize = 0
    while i < n {
        if (s⁅i⁆ as u32) == 69 {
            current = current + 1
        } else {
            current = current - 1
        }
        if current > peak {
            peak = current
        }
        i = i + 1
    }
    return peak
}

class Solution {
    micro minimumChairs(self, s: utf8): i64 {
        return minimum_chairs(s)
    }
}
