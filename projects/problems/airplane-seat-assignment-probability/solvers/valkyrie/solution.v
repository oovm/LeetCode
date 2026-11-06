namespace leetcode.airplane_seat_assignment_probability;

[export(case: "camelCase")]
micro nth_person_gets_nth_seat(n: i64) -> f64 {
    if n == 1 {
        return 1.0
    }
    return 0.5
}

class Solution {
    micro nthPersonGetsNthSeat(self, n: i64): f64 {
        return nth_person_gets_nth_seat(n)
    }
}
