namespace leetcode.decode_xored_array;

class Solution {
    micro decode(self, encoded: ArrayList<i64>, first: i64): ArrayList<i64> {
        let mut result: ArrayList<i64> = ArrayList::new(encoded.length() + 1)
        result.push(first)
        let mut i: usize = 0
        while i < encoded.length() {
            let enc: i64 = encoded⁅i⁆.unwrap()
            let prev: i64 = result⁅i + 1⁆.unwrap()
            result.push(prev ^ enc)
            i = i + 1
        }
        return result
    }
}
