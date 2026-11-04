namespace leetcode.time_needed_to_buy_tickets;

using std.collection;

# 直接计数：第 k 人买到 target 张时，左侧（含 k）每人最多贡献 target 张，右侧最多 target-1 张。
# 时间 O(n) 空间 O(1)。
[export(case: "camelCase")]
micro time_required_to_buy(tickets: ArrayList<i64>, k: i64) -> i64 {
    let pos: usize = k as usize
    let target: i64 = tickets⁅pos⁆
    let mut time: i64 = 0
    let mut i: usize = 0
    while i < tickets.length() {
        let mut cap: i64 = target - 1
        if i as i64 <= k {
            cap = target
        }
        let available: i64 = tickets⁅i⁆
        if available < cap {
            time = time + available
        } else {
            time = time + cap
        }
        i = i + 1
    }
    return time
}

class Solution {
    micro timeRequiredToBuy(self, tickets: ArrayList<i64>, k: i64): i64 {
        return time_required_to_buy(tickets, k)
    }
}
