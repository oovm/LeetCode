namespace leetcode.lexicographical_numbers;

[export(case: "camelCase")]
micro lexical_order(n: i64) -> ArrayList<i64> {
    let mut result: ArrayList<i64> = ArrayList::new(n as usize)
    let mut v: i64 = 1
    let mut i: i64 = 0
    while i < n {
        result.push(v)
        if v * 10 <= n {
            v = v * 10
        } else {
            while v % 10 == 9 || v + 1 > n {
                v = v / 10
            }
            v = v + 1
        }
        i = i + 1
    }
    return result
}

class Solution {
    micro lexicalOrder(self, n: i64): ArrayList<i64> {
        return lexical_order(n)
    }
}
