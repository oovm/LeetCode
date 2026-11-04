namespace leetcode.solution

using std.collection

# 题内触发点: `BitSet(2^k)` 记录所有长度为 k 的子串码值；置位数只能外部累计（G25 无 `count`）。
class Solution {
    [export(case: "hasAllCodes")]
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
        let mut found: usize = 0
        let mut start: usize = 0
        while start + width <= length {
            let mut value: usize = 0
            let mut offset: usize = 0
            while offset < width {
                let code: u8 = s.byte_at(start + offset)
                value = value * 2 + ((code - 48) as usize)
                offset = offset + 1
            }
            if !codes.get(value) {
                codes.set(value)
                found = found + 1
            }
            start = start + 1
        }
        if found == universe {
            return true
        }
        return false
    }
}
