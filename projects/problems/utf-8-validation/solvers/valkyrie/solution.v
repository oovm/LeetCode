namespace leetcode.utf_8_validation;

[export(case: "camelCase")]
micro valid_utf8(data: ArrayList<i64>) -> bool {
    let mut remaining: i64 = 0
    let n: usize = data.length()
    let mut i: usize = 0
    while i < n {
        let v: i64 = data⁅i⁆.unwrap()
        if remaining > 0 {
            if v / 64 != 2 {
                return false
            }
            remaining = remaining - 1
        } else if v / 128 == 0 {
            remaining = 0
        } else if v / 32 == 6 {
            remaining = 1
        } else if v / 16 == 14 {
            remaining = 2
        } else if v / 8 == 30 {
            remaining = 3
        } else {
            return false
        }
        i = i + 1
    }
    return remaining == 0
}

class Solution {
    micro validUtf8(self, data: ArrayList<i64>): bool {
        return valid_utf8(data)
    }
}
