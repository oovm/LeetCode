namespace leetcode.dota2_senate;

using std.collection;

# 双队列模拟：两方各存己方参议员下标；每轮下标较小者存活并把下标后移 n，另一方被禁言。
# 时间 O(n) 空间 O(n)。
[export(case: "camelCase")]
micro predict_party_victory(senate: utf8) -> utf8 {
    let n: usize = senate.length()
    let mut radiant: Deque<i64> = Deque::new()
    let mut dire: Deque<i64> = Deque::new()
    let mut i: usize = 0
    while i < n {
        if senate⁅i⁆ as u32 == 82 {
            radiant.push_back(i as i64)
        } else {
            dire.push_back(i as i64)
        }
        i = i + 1
    }

    let mut offset: i64 = n as i64
    while radiant.is_empty() == false && dire.is_empty() == false {
        let r: i64 = radiant.pop_front().unwrap()
        let d: i64 = dire.pop_front().unwrap()
        if r < d {
            radiant.push_back(r + offset)
        } else {
            dire.push_back(d + offset)
        }
        offset = offset + 1
    }
    if radiant.is_empty() == false {
        return "Radiant"
    }
    return "Dire"
}

class Solution {
    micro predictPartyVictory(self, senate: utf8): utf8 {
        return predict_party_victory(senate)
    }
}
