namespace leetcode.number_of_even_and_odd_bits;

# 统计偶位与奇位上的置位数。
[export(case: "camelCase")]
micro even_odd_bit(n: i64) -> ArrayList<i64> {
    let mut even: i64 = 0
    let mut odd: i64 = 0
    let mut bit: i64 = 0
    let mut value: i64 = n
    while value > 0 {
        if value % 2 == 1 {
            if bit % 2 == 0 {
                even = even + 1
            } else {
                odd = odd + 1
            }
        }
        value = value / 2
        bit = bit + 1
    }
    let mut result: ArrayList<i64> = ArrayList::new(2)
    result.push(even)
    result.push(odd)
    return result
}

class Solution {
    micro evenOddBit(self, n: i64): ArrayList<i64> {
        return even_odd_bit(n)
    }
}
