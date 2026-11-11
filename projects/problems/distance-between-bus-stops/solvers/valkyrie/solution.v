namespace leetcode.distance_between_bus_stops;

using std.collection;
using std.math;

# 环形路线：顺时针弧长与总长之差的较小者即答案。
[export(case: "camelCase")]
micro distanceBetweenBusStops(distance: [i64], start: i64, destination: i64) -> i64 {
    let mut a: usize = 0
    let mut b: usize = 0
    if start < destination {
        a = start as usize
        b = destination as usize
    } else {
        a = destination as usize
        b = start as usize
    }
    let mut forward: i64 = 0
    let mut total: i64 = 0
    let mut index: usize = 0
    while index < distance.length() {
        total = total + distance⁅index⁆
        if index >= a && index < b {
            forward = forward + distance⁅index⁆
        }
        index = index + 1
    }
    return min(forward, total - forward)
}

class Solution {
    micro distanceBetweenBusStops(self, distance: [i64], start: i64, destination: i64): i64 {
        return distanceBetweenBusStops(distance, start, destination)
    }
}
