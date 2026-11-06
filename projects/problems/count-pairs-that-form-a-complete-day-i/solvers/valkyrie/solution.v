namespace leetcode.count_pairs_that_form_a_complete_day_i;

using std.collection;

# 模 24 计频，配对数为之前出现的互补余数个数。
[export(case: "camelCase")]
micro countCompleteDayPairs(hours: ArrayList<i64>) -> i64 {
    let mut counts: ArrayList<i64> = ArrayList::new(24)
    let mut slot: usize = 0
    while slot < 24 {
        counts.push(0)
        slot = slot + 1
    }
    let mut answer: i64 = 0
    let mut index: usize = 0
    while index < hours.length() {
        let remainder: i64 = hours⁅index⁆ % 24
        let need: i64 = (24 - remainder) % 24
        answer = answer + counts⁅need as usize⁆
        counts⁅remainder as usize⁆ = counts⁅remainder as usize⁆ + 1
        index = index + 1
    }
    return answer
}

class Solution {
    micro countCompleteDayPairs(self, hours: ArrayList<i64>): i64 {
        return countCompleteDayPairs(hours)
    }
}
