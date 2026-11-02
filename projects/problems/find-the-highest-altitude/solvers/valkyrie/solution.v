namespace leetcode.find_the_highest_altitude;

[export(case: "camelCase")]
micro largest_altitude(gain: ArrayList<i64>) -> i64 {
    let mut best: i64 = 0
    let mut cur: i64 = 0
    let mut i: usize = 0
    while i < gain.length() {
        cur = cur + gain⁅i⁆.unwrap()
        if cur > best {
            best = cur
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro largestAltitude(self, gain: ArrayList<i64>): i64 {
        return largest_altitude(gain)
    }
}
