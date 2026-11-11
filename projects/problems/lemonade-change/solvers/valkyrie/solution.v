namespace leetcode.lemonade_change

# 面额只有 5/10/20：10 元必须用 5 元找零，20 元优先用 10+5、否则用三张 5。
[export(case: "camelCase")]
micro lemonadeChange(bills: [i64]) -> bool {
    let count: usize = bills.length()
    let mut five: i64 = 0
    let mut ten: i64 = 0
    let mut i: usize = 0
    while i < count {
        let bill: i64 = bills⁅i⁆
        if bill == 5 {
            five = five + 1
        }
        if bill == 10 {
            if five == 0 {
                return false
            }
            five = five - 1
            ten = ten + 1
        }
        if bill == 20 {
            let mut handled: bool = false
            if five > 0 && ten > 0 {
                five = five - 1
                ten = ten - 1
                handled = true
            }
            if handled == false {
                if five >= 3 {
                    five = five - 3
                    handled = true
                }
            }
            if handled == false {
                return false
            }
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro lemonadeChange(self, bills: [i64]): bool {
        return lemonadeChange(bills)
    }
}
