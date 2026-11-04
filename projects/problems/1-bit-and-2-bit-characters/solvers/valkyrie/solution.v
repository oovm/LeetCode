namespace leetcode.solution

using std.collection

# 从前往后按编码宽度跳：0 占 1 位，1 占 2 位；最后一步若正好落在末位，末位就是单比特字符。
class Solution {
    [export(case: "isOneBitCharacter")]
    micro isOneBitCharacter(bits: ArrayList<i64>) -> bool {
        let count: usize = bits.length()
        let mut index: usize = 0
        while index + 1 < count {
            if bits⁅index⁆ == 1 {
                index = index + 2
            } else {
                index = index + 1
            }
        }
        if index == count - 1 {
            return true
        }
        return false
    }
}
