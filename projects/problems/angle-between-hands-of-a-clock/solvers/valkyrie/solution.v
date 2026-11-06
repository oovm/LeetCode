namespace leetcode.angle_between_hands_of_a_clock;

[export(case: "camelCase")]
micro angle_clock(hour: i64, minutes: i64) -> f64 {
    let hour_angle: f64 = 30.0 * (hour % 12) as f64 + 0.5 * minutes as f64
    let minute_angle: f64 = 6.0 * minutes as f64
    let mut diff: f64 = hour_angle - minute_angle
    if diff < 0.0 {
        diff = 0.0 - diff
    }
    if diff > 180.0 {
        diff = 360.0 - diff
    }
    return diff
}

class Solution {
    micro angleClock(self, hour: i64, minutes: i64): f64 {
        return angle_clock(hour, minutes)
    }
}
