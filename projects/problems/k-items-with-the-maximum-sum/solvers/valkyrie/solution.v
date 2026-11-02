namespace leetcode.k_items_with_the_maximum_sum;

micro min_i64(a: i64, b: i64) -> i64 {
    if a < b {
        return a
    }
    return b
}

[export(case: "camelCase")]
micro k_items_with_maximum_sum(numOnes: i64, numZeros: i64, numNegOnes: i64, k: i64) -> i64 {
    let ones: i64 = min_i64(numOnes, k)
    let mut remaining: i64 = k - ones
    let zeros: i64 = min_i64(numZeros, remaining)
    remaining = remaining - zeros
    let neg_ones: i64 = min_i64(numNegOnes, remaining)
    return ones - neg_ones
}

class Solution {
    micro kItemsWithMaximumSum(self, numOnes: i64, numZeros: i64, numNegOnes: i64, k: i64): i64 {
        return k_items_with_maximum_sum(numOnes, numZeros, numNegOnes, k)
    }
}
