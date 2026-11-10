namespace leetcode.count_items_matching_a_rule;

using std.collection;

# ruleKey 映射到槽位 0/1/2，统计对应槽位等于 ruleValue 的条目数。
[export(case: "camelCase")]
micro countMatches(items: ArrayList<ArrayList<utf8>>, ruleKey: utf8, ruleValue: utf8) -> i64 {
    let mut slot: usize = 0
    if ruleKey == "color" {
        slot = 1
    } else if ruleKey == "name" {
        slot = 2
    }
    let mut count: i64 = 0
    loop item in items {
        if item⁅slot⁆ == ruleValue {
            count = count + 1
        }
    }
    return count
}

class Solution {
    micro countMatches(self, items: ArrayList<ArrayList<utf8>>, ruleKey: utf8, ruleValue: utf8): i64 {
        return countMatches(items, ruleKey, ruleValue)
    }
}
