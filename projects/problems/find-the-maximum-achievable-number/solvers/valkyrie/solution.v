namespace leetcode.find_the_maximum_achievable_number;

[export(case: "camelCase")]
micro the_maximum_achievable_x(num: i64, t: i64) -> i64 {
    return num + t * 2
}

class Solution {
    micro theMaximumAchievableX(self, num: i64, t: i64): i64 {
        return the_maximum_achievable_x(num, t)
    }
}
