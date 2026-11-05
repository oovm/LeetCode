namespace leetcode.longest_well_performing_interval;

using std.collection;

# 前缀和把「大于 8 分钟」记 +1、其余记 -1；只需记录每个前缀首次出现位置，
# 对每个位置查 score-1 的首次位置即可得到最长正和区间（一次线性扫描）。
[export(case: "camelCase")]
micro longest_wpi(hours: ArrayList<i64>) -> i64 {
    let mut first_position: HashMap<i64, i64> = HashMap::new(hours.length() + 1)
    let mut score: i64 = 0
    let mut best: i64 = 0

    let count: i64 = hours.length() as i64
    let mut index: i64 = 0
    while index < count {
        if hours⁅index as usize⁆ > 8 {
            score = score + 1
        } else {
            score = score - 1
        }

        if score > 0 {
            best = index + 1
        } else if first_position.contains_key(score - 1) {
            let previous: i64 = first_position.get(score - 1).unwrap()
            let length: i64 = index - previous
            if length > best {
                best = length
            }
        }

        if !first_position.contains_key(score) {
            first_position.insert(score, index)
        }
        index = index + 1
    }
    return best
}

class Solution {
    micro longestWPI(self, hours: ArrayList<i64>): i64 {
        return longest_wpi(hours)
    }
}
