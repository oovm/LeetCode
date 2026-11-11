namespace leetcode.gray_code;

[export(case: "camelCase")]
micro gray_code(n: i64) -> [i64] {
    let mut total: i64 = 1
    let mut j: i64 = 0
    while j < n {
        total = total * 2
        j = j + 1
    }
    let mut result: ArrayList<i64> = ArrayList::new(total as usize)
    let mut i: i64 = 0
    while i < total {
        result.push(i.bit_xor(i / 2))
        i = i + 1
    }
    return result.to_array()
}

class Solution {
    micro grayCode(self, n: i64): [i64] {
        return gray_code(n)
    }
}
