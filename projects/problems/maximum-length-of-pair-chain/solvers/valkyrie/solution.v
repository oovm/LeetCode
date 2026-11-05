namespace leetcode.maximum_length_of_pair_chain;

using std.collection;

micro compare_second(a: ArrayList<i64>, b: ArrayList<i64>) -> i32 {
    let left: i64 = a⁅1⁆
    let right: i64 = b⁅1⁆
    if left < right {
        return -1
    }
    if left > right {
        return 1
    }
    return 0
}

# 按右端点升序后贪心：能接就接（区间不重叠条件为严格小于）。
[export(case: "camelCase")]
micro findLongestChain(pairs: ArrayList<ArrayList<i64>>) -> i64 {
    let ordered: ArrayList<ArrayList<i64>> = sorted_by(pairs, compare_second)
    let mut chain: i64 = 0
    let mut previous: i64 = 0
    let mut started: bool = false
    let mut index: usize = 0
    while index < ordered.length() {
        let pair: ArrayList<i64> = ordered⁅index⁆
        let start: i64 = pair⁅0⁆
        let end: i64 = pair⁅1⁆
        if !started || previous < start {
            chain = chain + 1
            previous = end
            started = true
        }
        index = index + 1
    }
    return chain
}

class Solution {
    micro findLongestChain(self, pairs: ArrayList<ArrayList<i64>>): i64 {
        return findLongestChain(pairs)
    }
}
