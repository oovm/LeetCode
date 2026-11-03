namespace leetcode.most_expensive_item_that_can_not_be_bought;

# Frobenius 数：两互质面额不可表示的最大值 = p1·p2 - p1 - p2。
[export(case: "camelCase")]
micro most_expensive_item(primeOne: i64, primeTwo: i64) -> i64 {
    return primeOne * primeTwo - primeOne - primeTwo
}

class Solution {
    micro mostExpensiveItem(self, primeOne: i64, primeTwo: i64): i64 {
        return most_expensive_item(primeOne, primeTwo)
    }
}
