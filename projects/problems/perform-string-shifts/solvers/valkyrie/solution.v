namespace leetcode.perform_string_shifts;

using std.collection;

# 先把所有位移合成一个净位移，再用 `slice(start, count)` 取两段后 `concat`：
# 右移 amount 等价于「后 amount 个字符 + 前 n-amount 个字符」。
# 题内触发点: `utf8.slice` 的 second 参数是 **count 而非终点**（`Utf8Text.v` L262），
# 因此切点要自己算成段长。
[export(case: "camelCase")]
micro string_shift(s: utf8, shift: ArrayList<ArrayList<i64>>) -> utf8 {
    let total: i64 = s.length() as i64
    let mut amount: i64 = 0
    let mut i: usize = 0
    while i < shift.length() {
        let step: ArrayList<i64> = shift⁅i⁆
        let direction: i64 = step⁅0⁆
        let distance: i64 = step⁅1⁆
        if direction == 1 {
            amount = amount + distance
        } else {
            amount = amount - distance
        }
        i = i + 1
    }

    amount = amount % total
    if amount < 0 {
        amount = amount + total
    }

    let cut: usize = (total - amount) as usize
    return s.slice(cut, amount as usize).concat(s.slice(0, cut))
}

class Solution {
    micro stringShift(self, s: utf8, shift: ArrayList<ArrayList<i64>>): utf8 {
        return string_shift(s, shift)
    }
}
