namespace leetcode.solution

using std.collection

# 题内触发点: `BitSet(2^k)` 记录所有长度为 k 的子串码值；置位数直接由 `count()` 给出（G25）。
class Solution {
    [export(case: "camelCase")]
    micro hasAllCodes(s: utf8, k: i64) -> bool {
        let width: usize = k as usize
        let mut universe: usize = 1
        let mut step: usize = 0
        while step < width {
            universe = universe * 2
            step = step + 1
        }
        let codes: BitSet = BitSet::with_capacity(universe)
        let length: usize = s.byte_length()
        if length < width {
            return false
        }
        let mut start: usize = 0
        while start + width <= length {
            let mut value: usize = 0
            let mut offset: usize = 0
            while offset < width {
                let code: u8 = s.byte_at(start + offset)
                value = value * 2 + ((code - 48) as usize)
                offset = offset + 1
            }
            codes.set(value)
            start = start + 1
        }
        return codes.count() == universe
    }
}
