namespace leetcode.building_boxes;

# 完整三角垛 h 层共 h(h+1)(h+2)/6 箱，剩余箱用最小三角数 t(t+1)/2 补齐占地。
[export(case: "camelCase")]
micro minimum_boxes(n: i64) -> i64 {
    let mut h: i64 = 0
    while (h + 1) * (h + 2) * (h + 3) / 6 <= n {
        h = h + 1
    }
    let rest: i64 = n - h * (h + 1) * (h + 2) / 6
    let mut t: i64 = 0
    while t * (t + 1) / 2 < rest {
        t = t + 1
    }
    return h * (h + 1) / 2 + t
}

class Solution {
    micro minimumBoxes(self, n: i64): i64 {
        return minimum_boxes(n)
    }
}
