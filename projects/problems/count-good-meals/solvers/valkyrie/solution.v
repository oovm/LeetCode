namespace leetcode.count_good_meals;

using std.collection;

# 两个元素之和为 2 的幂。对每个当前值检查所有可能的幂（最多 22 个），
# 用哈希累计之前出现过的互补值，O(22n)。
[export(case: "camelCase")]
micro countPairs(deliciousness: ArrayList<i64>) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(deliciousness.length())
    let mut total: i64 = 0
    let mut i: usize = 0
    while i < deliciousness.length() {
        let value: i64 = deliciousness⁅i⁆
        let mut power: i64 = 1
        while power <= 1073741824 {
            let wanted: i64 = power - value
            if counts.contains_key(wanted) {
                total = total + counts.get(wanted).unwrap()
            }
            power = power * 2
        }
        total = total % 1000000007
        let mut amount: i64 = 1
        if counts.contains_key(value) {
            amount = counts.get(value).unwrap() + 1
        }
        counts.insert(value, amount)
        i = i + 1
    }
    return total
}

class Solution {
    micro countPairs(self, deliciousness: ArrayList<i64>): i64 {
        return countPairs(deliciousness)
    }
}
