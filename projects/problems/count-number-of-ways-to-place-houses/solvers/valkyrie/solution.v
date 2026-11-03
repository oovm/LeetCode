namespace leetcode.count_number_of_ways_to_place_houses;

# 单侧方案数 Fibonacci 滚动：f(0)=1, f(1)=2, f(i)=f(i-1)+f(i-2)；答案 f(n)² mod 10^9+7。
[export(case: "camelCase")]
micro count_house_placements(n: i64) -> i64 {
    let mut prev2: i64 = 1
    let mut prev1: i64 = 2
    let mut i: i64 = 2
    while i <= n {
        let current: i64 = (prev1 + prev2) % 1000000007
        prev2 = prev1
        prev1 = current
        i = i + 1
    }
    return prev1 * prev1 % 1000000007
}

class Solution {
    micro countHousePlacements(self, n: i64): i64 {
        return count_house_placements(n)
    }
}
