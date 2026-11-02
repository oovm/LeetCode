namespace leetcode.distribute_money_to_maximum_children;

[export(case: "camelCase")]
micro dist_money(money: i64, children: i64) -> i64 {
    if money < children {
        return -1
    }
    let mut max_eight: i64 = children
    if money / 8 < max_eight {
        max_eight = money / 8
    }
    while max_eight >= 0 {
        let remaining_money: i64 = money - max_eight * 8
        let remaining_children: i64 = children - max_eight
        if remaining_money < remaining_children {
            max_eight = max_eight - 1
            continue
        }
        if remaining_children == 0 {
            if remaining_money == 0 {
                return max_eight
            }
            max_eight = max_eight - 1
            continue
        }
        let extra: i64 = remaining_money - remaining_children
        if extra == 3 && remaining_children == 1 {
            max_eight = max_eight - 1
            continue
        }
        return max_eight
    }
    return -1
}

class Solution {
    micro distMoney(self, money: i64, children: i64): i64 {
        return dist_money(money, children)
    }
}
