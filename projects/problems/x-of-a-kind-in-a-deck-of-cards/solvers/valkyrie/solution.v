namespace leetcode.x_of_a_kind_in_a_deck_of_cards;

using std.collection;
using std.math;

# 全体频次求最大公约数：gcd > 1 当且仅当存在合法分组大小（分组数可大于 1）。
# 题内触发点: G23 —— `std.math` 只有 `basic`（abs / max / min，且只收 f64）、
# 分布、图论与 `splitmix64`，没有数论模块，也没有整数 gcd / lcm。
# 理想写法是一次 gcd 归约；手写 Euclid 循环属题内补缺，本轮不写。
[export(case: "camelCase")]
micro has_groups_size_x(deck: [i64]) -> bool {
    let count: usize = deck.length()
    let mut counts: HashMap<i64, i64> = HashMap::new(count)
    let mut i: usize = 0
    while i < count {
        let value: i64 = deck⁅i⁆
        let mut seen: i64 = 0
        if counts.contains_key(value) {
            seen = counts.get(value).unwrap()
        }
        counts.insert(value, seen + 1)
        i = i + 1
    }

    let values: ArrayList<i64> = counts.values()
    let mut group: i64 = 0
    i = 0
    while i < values.length() {
        group = gcd(group, values⁅i⁆)
        i = i + 1
    }
    return group >= 2
}

class Solution {
    micro hasGroupsSizeX(self, deck: [i64]): bool {
        return has_groups_size_x(deck)
    }
}
