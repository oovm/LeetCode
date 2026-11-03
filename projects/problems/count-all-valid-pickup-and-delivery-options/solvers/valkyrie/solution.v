namespace leetcode.count_all_valid_pickup_and_delivery_options;

# (2n)!/2^n = Π i·(2i-1)，逐步取模。
[export(case: "camelCase")]
micro count_orders(n: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 2
    while i <= n {
        result = result * i % 1000000007
        result = result * (2 * i - 1) % 1000000007
        i = i + 1
    }
    return result
}

class Solution {
    micro countOrders(self, n: i64): i64 {
        return count_orders(n)
    }
}
