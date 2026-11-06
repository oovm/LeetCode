namespace leetcode.most_frequent_even_element;

using std.collection;

# 统计偶数频次；频次最高者优先，并列取数值最小；无偶数返回 -1。
[export(case: "camelCase")]
micro mostFrequentEven(nums: ArrayList<i64>) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut best: i64 = -1
    let mut best_count: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        if value % 2 == 0 {
            let mut current: i64 = 1
            if counts.contains_key(value) {
                current = counts.get(value).unwrap() + 1
            }
            counts.insert(value, current)
            if current > best_count || (current == best_count && value < best) {
                best = value
                best_count = current
            }
        }
        index = index + 1
    }
    return best
}

class Solution {
    micro mostFrequentEven(self, nums: ArrayList<i64>): i64 {
        return mostFrequentEven(nums)
    }
}
