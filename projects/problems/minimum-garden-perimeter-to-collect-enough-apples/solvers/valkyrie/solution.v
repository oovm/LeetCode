namespace leetcode.minimum_garden_perimeter_to_collect_enough_apples;

# 边长 2k 的方形果园苹果总量 S(k) = 2k(k+1)(2k+1)，最小 k 后周长 8k。
[export(case: "camelCase")]
micro minimum_perimeter(neededApples: i64) -> i64 {
    let mut k: i64 = 0
    while 2 * k * (k + 1) * (2 * k + 1) < neededApples {
        k = k + 1
    }
    return 8 * k
}

class Solution {
    micro minimumPerimeter(self, neededApples: i64): i64 {
        return minimum_perimeter(neededApples)
    }
}
