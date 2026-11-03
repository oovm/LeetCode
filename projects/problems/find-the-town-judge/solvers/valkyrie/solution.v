namespace leetcode.find_the_town_judge;

[export(case: "camelCase")]
micro find_judge(n: i64, trust: ArrayList<ArrayList<i64>>) -> i64 {
    let mut score: HashMap<i64, i64> = HashMap::new(0)
    let mut i: usize = 0
    while i < trust.length() {
        let pair: ArrayList<i64> = trust⁅i⁆
        let a: i64 = pair⁅0⁆
        let b: i64 = pair⁅1⁆
        let mut sa: i64 = 0
        if score.contains_key(a) {
            sa = score.get(a).unwrap()
        }
        score.insert(a, sa - 1)
        let mut sb: i64 = 0
        if score.contains_key(b) {
            sb = score.get(b).unwrap()
        }
        score.insert(b, sb + 1)
        i = i + 1
    }
    let mut person: i64 = 1
    while person <= n {
        let mut s: i64 = 0
        if score.contains_key(person) {
            s = score.get(person).unwrap()
        }
        if s == n - 1 {
            return person
        }
        person = person + 1
    }
    return -1
}

class Solution {
    micro findJudge(self, n: i64, trust: ArrayList<ArrayList<i64>>): i64 {
        return find_judge(n, trust)
    }
}
