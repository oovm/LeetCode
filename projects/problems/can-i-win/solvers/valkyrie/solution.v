namespace leetcode.can_i_win;

micro winner(used: i64, remaining: i64, maxPick: i64, memo: ArrayList<i64>) -> bool {
    let cached: i64 = memo⁅used as usize⁆
    if cached == 1 {
        return true
    }
    if cached == 2 {
        return false
    }
    let mut pick: i64 = 1
    while pick <= maxPick {
        let bit: i64 = 1 << (pick - 1)
        if (used & bit) == 0 {
            if pick >= remaining {
                memo⁅used as usize⁆ = 1
                return true
            }
            if !winner(used | bit, remaining - pick, maxPick, memo) {
                memo⁅used as usize⁆ = 1
                return true
            }
        }
        pick = pick + 1
    }
    memo⁅used as usize⁆ = 2
    return false
}

[export(case: "camelCase")]
micro canIWin(maxChoosableInteger: i64, desiredTotal: i64) -> bool {
    let total: i64 = maxChoosableInteger * (maxChoosableInteger + 1) / 2
    if total < desiredTotal {
        return false
    }
    if desiredTotal <= 0 {
        return true
    }
    let states: i64 = 1 << maxChoosableInteger
    let mut memo: ArrayList<i64> = ArrayList::new(states as usize)
    let mut slot: i64 = 0
    while slot < states {
        memo.push(0)
        slot = slot + 1
    }
    return winner(0, desiredTotal, maxChoosableInteger, memo)
}

class Solution {
    micro canIWin(self, maxChoosableInteger: i64, desiredTotal: i64): bool {
        return canIWin(maxChoosableInteger, desiredTotal)
    }
}
