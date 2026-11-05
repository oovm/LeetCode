namespace leetcode.rabbits_in_forest;

using std.collection;

# 回答 `v` 的兔子属于大小为 `v + 1` 的组。每种回答按组向上取整计数，
# 同一组的兔子总数一次算清，O(n)。
[export(case: "camelCase")]
micro numRabbits(answers: ArrayList<i64>) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(answers.length())
    let mut i: usize = 0
    while i < answers.length() {
        let value: i64 = answers⁅i⁆
        let mut amount: i64 = 1
        if counts.contains_key(value) {
            amount = counts.get(value).unwrap() + 1
        }
        counts.insert(value, amount)
        i = i + 1
    }

    let mut total: i64 = 0
    let keys: ArrayList<i64> = counts.keys()
    let mut k: usize = 0
    while k < keys.length() {
        let value: i64 = keys⁅k⁆
        let amount: i64 = counts.get(value).unwrap()
        let group: i64 = value + 1
        let groups: i64 = (amount + value) / group
        total = total + groups * group
        k = k + 1
    }
    return total
}

class Solution {
    micro numRabbits(self, answers: ArrayList<i64>): i64 {
        return numRabbits(answers)
    }
}
