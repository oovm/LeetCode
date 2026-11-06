namespace leetcode.find_if_digit_game_can_be_won;

using std.collection;

# 两位数和其余数字各自求和，Alice 选两位数组，总和不同即获胜（相同为平局）。
[export(case: "camelCase")]
micro canAliceWin(nums: ArrayList<i64>) -> bool {
    let mut two_digit: i64 = 0
    let mut single_digit: i64 = 0
    loop value in nums {
        if value >= 10 {
            two_digit = two_digit + value
        } else {
            single_digit = single_digit + value
        }
    }
    return two_digit != single_digit
}

class Solution {
    micro canAliceWin(self, nums: ArrayList<i64>): bool {
        return canAliceWin(nums)
    }
}
