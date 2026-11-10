namespace leetcode.contiguous_array;

using std.collection;

# 把 0 视作 -1 求前缀平衡：同一平衡值首次出现下标缓存，跨度即等长 0/1 子数组。
[export(case: "camelCase")]
micro findMaxLength(nums: ArrayList<i64>) -> i64 {
    let mut firstSeen: HashMap<i64, i64> = HashMap::new(0)
    firstSeen.insert(0, -1)
    let mut balance: i64 = 0
    let mut best: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        if nums⁅index⁆ == 1 {
            balance = balance + 1
        } else {
            balance = balance - 1
        }
        if firstSeen.contains_key(balance) {
            let span: i64 = index as i64 - firstSeen.get(balance).unwrap()
            if span > best {
                best = span
            }
        } else {
            firstSeen.insert(balance, index as i64)
        }
        index = index + 1
    }
    return best
}

class Solution {
    micro findMaxLength(self, nums: ArrayList<i64>): i64 {
        return findMaxLength(nums)
    }
}
