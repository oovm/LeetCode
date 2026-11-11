namespace leetcode.card_flipping_game;

using std.collection;

# 正反面同值的卡片无法翻出别的数字，它上面的值不可用；
# 其余候选值只需扫描一遍取最小可行值，O(n)。
[export(case: "camelCase")]
micro flipgame(fronts: [i64], backs: [i64]) -> i64 {
    let mut blocked: HashMap<i64, i64> = HashMap::new(fronts.length())
    let mut i: usize = 0
    while i < fronts.length() {
        if fronts⁅i⁆ == backs⁅i⁆ {
            blocked.insert(fronts⁅i⁆, 1)
        }
        i = i + 1
    }

    let mut best: i64 = 1000000000
    i = 0
    while i < fronts.length() {
        let value: i64 = fronts⁅i⁆
        if blocked.contains_key(value) == false && value < best {
            best = value
        }
        let back: i64 = backs⁅i⁆
        if blocked.contains_key(back) == false && back < best {
            best = back
        }
        i = i + 1
    }
    if best == 1000000000 {
        return 0
    }
    return best
}

class Solution {
    micro flipgame(self, fronts: [i64], backs: [i64]): i64 {
        return flipgame(fronts, backs)
    }
}
