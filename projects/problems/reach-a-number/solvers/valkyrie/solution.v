namespace leetcode.reach_a_number;

[export(case: "camelCase")]
micro reach_number(target: i64) -> i64 {
    let mut destination: i64 = target
    if destination < 0 {
        destination = -destination
    }
    let mut step: i64 = 1
    let mut travelled: i64 = 0
    while travelled < destination || (travelled - destination) % 2 != 0 {
        travelled = travelled + step
        step = step + 1
    }
    return step - 1
}

class Solution {
    micro reachNumber(self, target: i64): i64 {
        return reach_number(target)
    }
}
