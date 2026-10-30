namespace leetcode.decode_xored_array;

[export(case: "camelCase")]
micro decode(encoded: ArrayList<i64>, first: i64) -> ArrayList<i64> {
    let mut result: ArrayList<i64> = ArrayList::new(encoded.length() + 1)
    result.push(first)
    let mut i: usize = 0
    while i < encoded.length() {
        let enc: i64 = encoded⁅i⁆.unwrap()
        let prev: i64 = result⁅i⁆.unwrap()
        result.push(prev.bit_xor(enc))
        i = i + 1
    }
    return result
}

class Solution {
    micro decode(self, encoded: ArrayList<i64>, first: i64): ArrayList<i64> {
        return decode(encoded, first)
    }
}
