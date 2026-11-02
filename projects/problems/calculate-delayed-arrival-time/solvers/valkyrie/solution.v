namespace leetcode.calculate_delayed_arrival_time;

[export(case: "camelCase")]
micro find_delayed_arrival_time(arrivalTime: i64, delayedTime: i64) -> i64 {
    return (arrivalTime + delayedTime) % 24
}

class Solution {
    micro findDelayedArrivalTime(self, arrivalTime: i64, delayedTime: i64): i64 {
        return find_delayed_arrival_time(arrivalTime, delayedTime)
    }
}
