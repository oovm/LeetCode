namespace leetcode.maximum_split_of_positive_even_integers;

# 贪心取 2, 4, 6, ...，余数并入最后一项即可得到项数最多且互不相同的偶数和。
[export(case: "camelCase")]
micro maximum_even_split(finalSum: i64) -> ArrayList<i64> {
    let mut answer: ArrayList<i64> = ArrayList::new(0)
    if finalSum % 2 != 0 {
        return answer
    }
    let mut remaining: i64 = finalSum
    let mut next: i64 = 2
    while remaining >= next {
        answer.push(next)
        remaining = remaining - next
        next = next + 2
    }
    if remaining > 0 {
        let last: usize = answer.length() - 1
        answer⁅last⁆ = answer⁅last⁆ + remaining
    }
    return answer
}

class Solution {
    micro maximumEvenSplit(self, finalSum: i64): ArrayList<i64> {
        return maximum_even_split(finalSum)
    }
}
