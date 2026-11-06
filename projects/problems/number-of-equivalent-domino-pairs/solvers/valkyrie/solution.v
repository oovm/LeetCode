namespace leetcode.number_of_equivalent_domino_pairs;

using std.collection;

# 骨牌按小值为十位、大值为个位编码，同编码的累计配对次数。
[export(case: "camelCase")]
micro numEquivDominoPairs(dominoes: ArrayList<ArrayList<i64>>) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut pairs: i64 = 0
    let mut position: usize = 0
    while position < dominoes.length() {
        let first: i64 = dominoes⁅position⁆⁅0⁆
        let second: i64 = dominoes⁅position⁆⁅1⁆
        let mut low: i64 = first
        let mut high: i64 = second
        if first > second {
            low = second
            high = first
        }
        let key: i64 = low * 10 + high
        if counts.contains_key(key) {
            let seen: i64 = counts.get(key).unwrap()
            pairs = pairs + seen
            counts.insert(key, seen + 1)
        } else {
            counts.insert(key, 1)
        }
        position = position + 1
    }
    return pairs
}

class Solution {
    micro numEquivDominoPairs(self, dominoes: ArrayList<ArrayList<i64>>): i64 {
        return numEquivDominoPairs(dominoes)
    }
}
